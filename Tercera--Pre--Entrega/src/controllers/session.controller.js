const passport = require("passport");
const UserDTO = require("../dto/user.dto.js");

class SessionController {
    constructor() { }

    async login(req, res) {
        passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" })(req, res, async () => {
            if (!req.user) return res.status(400).send({ status: "error" });

            // Agregar lógica para asignar el rol
            const isAdmin = req.user.email.endsWith("@admin.com");
            req.user.role = isAdmin ? "admin" : "user";

            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                age: req.user.age,
                email: req.user.email,
                role: isAdmin ? "admin" : "user"
            };

            req.session.login = true;

            res.redirect("/profile");
        });
    }

    async getCurrentUser(req, res) {
        try {
            // Crear un DTO con la información necesaria del usuario
            const userDTO = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
            // Enviar el DTO en lugar del objeto completo del usuario
            res.status(200).json(userDTO);
        } catch (error) {
            res.status(500).json({ error: "Error del servidor" });
        }
    }

    async failLogin(req, res) {
        res.send({ error: "Error en el inicio de sesión" });
    }

    async register(req, res) {
        if (req.session.login) {
            return res.redirect("/");
        }
    }

    async logout(req, res) {
        if (req.session.login) {
            req.session.destroy();
        }
        res.redirect("/");
    }

    async githubCallback(req, res) {
        req.session.user = req.user;
        req.session.login = true;
        res.redirect("/profile");
    }
}

module.exports = SessionController;
