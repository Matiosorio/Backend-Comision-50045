const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { createHash } = require("../utils/hashbcrypt.js");
const passport = require("passport");


router.post("/", passport.authenticate("register", {failureRedirect: "/failedregister"}), async (req, res) => {
    if(!req.user) return res.status(400).send({status:"error"});
    
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    //req.session.login = true;
    res.send('Usuario creado exitosamente. ¡Bienvenido! <a href="/login">Iniciar sesión</a>');
    //res.redirect("/login");
})

router.get("failedregister", (req, res) => {
    res.send({error: "Registro fallido"});
})

module.exports = router