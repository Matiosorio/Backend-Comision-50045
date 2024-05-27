const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();

router.post("/", userController.registerUser);
router.get("/failedregister", userController.failedRegister);

//Tercer integradora: 
router.post("/requestPasswordReset", userController.requestPasswordReset); // Nueva ruta
router.post('/reset-password', userController.resetPassword);
router.put("/premium/:uid", userController.changeRolePremium);


module.exports = router;
