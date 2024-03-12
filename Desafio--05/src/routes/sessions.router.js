const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");

//Login

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            // Es el usuario administrador
            req.session.login = true;
            req.session.user = { email: "adminCoder@coder.com", role: "admin" };
            return res.redirect("/products");
        }

        // No es el usuario administrador, buscar en la base de datos
        const user = await UserModel.findOne({ email: email });

        if (user) {
            if (user.password === password) {
                req.session.login = true;
                req.session.user = { ...user._doc };
                
                return res.redirect("/products");
            } else {
                return res.status(401).send({ error: "Contraseña no válida" });
            }
        } else {
            return res.status(404).send({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error en el login:", error);
        return res.status(400).send({ error: "Error en el login" });
    }
});

//Logout

router.get("/logout", (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

module.exports = router;