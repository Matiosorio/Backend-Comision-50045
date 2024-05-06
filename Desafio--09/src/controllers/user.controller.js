const passport = require("passport");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();

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
}

module.exports = UserController;
