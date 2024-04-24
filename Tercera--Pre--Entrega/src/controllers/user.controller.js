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
        // Crear el usuario
        const newUser = await userRepository.createUser(req.user);

        // Crear un carrito para el usuario
        const newCart = await cartRepository.createCart();

        // Asignar el carrito al usuario
        newUser.cart = newCart._id;

        // Guardar el usuario con la referencia al carrito en la base de datos
        await newUser.save();

        // Guardar el usuario en la sesión
        req.session.user = {
          _id: newUser._id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          age: newUser.age,
          email: newUser.email,
          cart: newCart._id
        };

        // Enviar respuesta de éxito
        res.send('Usuario creado exitosamente. ¡Bienvenido! <a href="/login">Iniciar sesión</a>');
      } catch (error) {
        // Manejar errores
        console.error("Error al crear usuario:", error);
        res.status(500).send({ error: error.message });
      }
    });
  }

  async failedRegister(req, res) {
    res.send({ error: "Registro fallido" });
  }
}

module.exports = UserController;
