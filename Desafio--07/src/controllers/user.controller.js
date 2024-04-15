const passport = require("passport");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();

class UserController {
  async registerUser(req, res) {
    passport.authenticate("register", { failureRedirect: "/api/users/failedregister" })(req, res, async () => {
      if (!req.user) return res.status(400).send({ status: "error" });

      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
      };

      try {
        const newUser = await userRepository.createUser(req.user);
        res.send('Usuario creado exitosamente. ¡Bienvenido! <a href="/login">Iniciar sesión</a>');
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });
  }

  async failedRegister(req, res) {
    res.send({ error: "Registro fallido" });
  }
}

module.exports = UserController;
