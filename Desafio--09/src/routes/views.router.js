const express = require("express");
const router = express.Router();
const ViewsController = require('../controllers/view.controller.js');
const viewsController = new ViewsController();
const { isAdmin, isUser } = require('../middleware/auth.middleware.js');


router.get("/profile", viewsController.profileView);

router.get("/products", isUser, viewsController.productsView); // Cambio aquí
router.get("/carts/:cid", isUser, viewsController.cartsView); // Cambio aquí
router.get("/login", viewsController.getLoginView);
router.get("/register", viewsController.getRegisterView);
router.get("/realTimeProducts", isAdmin, viewsController.realTimeProductsView);
router.get("/chat", isUser, viewsController.chatView);
router.get("/", viewsController.getHomeView);

module.exports = router;
