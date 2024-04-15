const express = require("express");
const router = express.Router();
const passport = require("passport");
const SessionController = require("../controllers/session.controller.js");
const sessionController = new SessionController();

// Login
router.post("/login", sessionController.login);

// Ruta para manejar el fallo en el inicio de sesión
router.get("/faillogin", sessionController.failLogin);

// Logout
router.get("/logout", sessionController.logout);

// Rutas relacionadas con OAuth (por ejemplo, GitHub)
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/githubcallback", sessionController.githubCallback);

module.exports = router;
