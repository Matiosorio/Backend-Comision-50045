const passport = require("passport");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const {generateResetToken} = require("../utils/tokenreset.js");
const UserModel = require("../models/user.model.js");

//Tercer integradora:
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();

class UserController {
  async registerUser(req, res) {
    passport.authenticate("register", { failureRedirect: "/api/users/failedregister" })(req, res, async () => {
      if (!req.user) return res.status(400).send({ status: "error" });

      try {
        // Verificar si el correo electrónico termina en "@admin.com"
        const isAdmin = req.user.email.endsWith("@admin.com");

        // Asignar el rol correspondiente
        req.user.role = isAdmin ? "admin" : "user";

        // Crear un carrito solo para los usuarios que no son administradores
        let newCart;
        if (req.user.role === "user") {
          newCart = await cartRepository.createCart();
        }

        // Crear el usuario
        const newUser = await userRepository.createUser(req.user);

        // Asignar el carrito al usuario si es necesario
        if (newCart) {
          newUser.cart = newCart._id;
        }

        // Guardar el usuario con la referencia al carrito en la base de datos
        await newUser.save();

        // Guardar el usuario en la sesión
        req.logger.info('Usuario creado exitosamente:', newUser);
        req.session.user = {
          _id: newUser._id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          age: newUser.age,
          email: newUser.email,
          cart: newCart ? newCart._id : null,
          role: newUser.role // Asegúrate de incluir el rol en la sesión
        };

        // Enviar respuesta de éxito
        res.send('Usuario creado exitosamente. ¡Bienvenido! <a href="/login">Iniciar sesión</a>');
      } catch (error) {
        // Manejar errores
        req.logger.error("Error al crear usuario:", error);
        res.status(500).send({ error: error.message });
      }
    });
  }

  async failedRegister(req, res) {
    req.logger.error("Registro fallido");
    res.send({ error: "Registro fallido" });
  }

  //Tercer practica integradora

  async requestPasswordReset(req, res) {
    const { email } = req.body;

    try {
      // Buscar al usuario por su correo electrónico
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      // Generar un token 
      const token = generateResetToken();

      // Guardar el token en el usuario
      user.resetToken = {
        token: token,
        expire: new Date(Date.now() + 3600000) // 1 hora de duración
      };
      await user.save();

      // Enviar correo electrónico con el enlace de restablecimiento utilizando EmailService
      await emailManager.sendPasswordResetEmail(email, user.first_name, token);

      res.redirect("/send-confirmation");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async resetPassword(req, res) {
    const { email, password, token } = req.body;

    try {
      // Buscar al usuario por su correo electrónico
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.render("changepassword", { error: "Usuario no encontrado" });
      }

      // Obtener el token de restablecimiento de la contraseña del usuario
      const resetToken = user.resetToken;
      if (!resetToken || resetToken.token !== token) {
        return res.render("passwordreset", { error: "El token de restablecimiento de contraseña es inválido" });
      }

      // Verificar si el token ha expirado
      const now = new Date();
      if (now > resetToken.expire) {
        // Redirigir a la página de generación de nuevo correo de restablecimiento
        return res.render("passwordreset", { error: "El token de restablecimiento de contraseña es inválido" });
      }

      // Verificar si la nueva contraseña es igual a la anterior
      if (isValidPassword(password, user)) {
        return res.render("changepassword", { error: "La nueva contraseña no puede ser igual a la anterior" });
      }

      // Actualizar la contraseña del usuario
      user.password = createHash(password);
      user.resetToken = undefined; // Marcar el token como utilizado
      await user.save();

      // Renderizar la vista de confirmación de cambio de contraseña
      return res.redirect("/login");
    } catch (error) {
      console.error(error);
      return res.status(500).render("passwordreset", { error: "Error interno del servidor" });
    }
  }

  async changeRolePremium(req, res) {
    try {
      const { uid } = req.params;

      const user = await UserModel.findById(uid);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const newRole = user.role === 'user' ? 'premium' : 'user';

      const updated = await UserModel.findByIdAndUpdate(uid, { role: newRole }, { new: true });
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

module.exports = UserController;
