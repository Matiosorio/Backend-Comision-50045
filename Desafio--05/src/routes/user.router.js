const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");

//Se genera el usuario y se almacena en MongoDB

router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body;

    try {
        console.log("Registrando nuevo usuario...");
        const existingUser = await UserModel.findOne({email:email});
        if(existingUser) {
            console.log("El email ya está registrado");
            return res.status(400).send({error: "El email ya está registrado"});
        }

        const newUser = await UserModel.create({
            first_name,
            last_name,
            password,
            email,
            age
        });
        console.log("Usuario creado exitosamente");
        //req.session.login = true;
        //req.session.user = {...newUser._doc};

        res.redirect("/login");
    } catch (error) {
        console.error("Error al crear el usuario", error);
        res.status(500).send({error: "Error al guardar el usuario"});
    }
});


module.exports = router