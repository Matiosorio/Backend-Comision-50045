const passport = require("passport");

class SessionController {
    constructor() {}

    async login(req, res) {
        passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" })(req, res, async () => {
            if (!req.user) return res.status(400).send({ status: "error" });

            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                age: req.user.age,
                email: req.user.email
            };

            req.session.login = true;

            res.redirect("/products");
        });
    }

    async failLogin(req, res) {
        res.send({ error: "Error en el inicio de sesión" });
    }

    async logout(req, res) {
        if (req.session.login) {
            req.session.destroy();
        }
        res.redirect("/login");
    }

    async githubCallback(req, res) {
        req.session.user = req.user;
        req.session.login = true;
        res.redirect("/products");
    }
}

module.exports = SessionController;
