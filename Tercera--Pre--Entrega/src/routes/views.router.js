const express = require("express");
const router = express.Router();
const ViewsController = require('../controllers/view.controller.js');
const { isAdmin } = require('../middleware/auth.middleware.js');
const {isUser} = require("../middleware/auth.middleware.js");
//const ProductRepository = require('../repositories/product.repository.js');
//const CartRepository = require('../repositories/cart.repository.js');

//const productRepository = new ProductRepository();
//const cartRepository = new CartRepository();

const viewsController = new ViewsController();

router.get("/profile", viewsController.profileView);

router.get("/products", viewsController.getProductsView);
router.get("/carts/:cid", viewsController.getCartsView);
router.get("/login", viewsController.getLoginView);
router.get("/register", viewsController.getRegisterView);
router.get("/realTimeProducts", isAdmin, viewsController.realTimeProductsView); // Protegido por el middleware isAdmin
router.get("/chat", isUser, viewsController.chatView);
router.get("/", viewsController.getHomeView);

module.exports = router;

