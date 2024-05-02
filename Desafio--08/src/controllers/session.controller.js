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
                role: isAdmin ? "admin" : "user",
                cartId: req.user.cart ? req.user.cart._id : null
            };

            console.log("Contenido de req.session.user:", req.session.user);
            // Agregar registro para imprimir req.user.cart
            console.log("Contenido de req.user.cart:", req.user.cart);

            req.session.login = true;

            res.redirect("/profile");
        });
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
