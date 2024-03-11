const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");

//Login

router.post ("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        //Se busca al usuario
        const user = await UserModel.findOne({email: email});
        if(user) {
            if(user.password === password) {
                req.session.login = true;
                req.session.user = {...user._doc};

                res.redirect("/products");
            } else {
                res.status(401).send({error: "Contraseña no valida"})
            }
        } else {
            res.status(404).send({error: "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(400).send({error: "Error en el login"});
    }
})

//Logout

router.get("/logout", (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

module.exports = router;