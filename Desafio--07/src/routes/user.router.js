const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();

router.post("/", userController.registerUser);
router.get("/failedregister", userController.failedRegister);

module.exports = router;
