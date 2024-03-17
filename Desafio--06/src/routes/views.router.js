const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/ProductManager-Db.js");
const productManager = new ProductManager();

const CartManager = require("../controllers/CartManager-Db.js");
const cartManager = new CartManager();


router.get("/products", async (req, res) => {
   try {
      if (!req.session.login) {
         return res.redirect("/login");
      }

      const { page = 1, limit = 2 } = req.query;
      const products = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      const newArray = products.docs.map(product => {
         const { _id, ...rest } = product.toObject();
         return rest;
      });

      // Verificar si el usuario es administrador
      const isAdmin = req.session.user && req.session.user.role === "admin";

      // Renderizar la vista de productos con un mensaje de bienvenida diferente
      res.render("products", {
         user: req.session.user,
         isAdmin: isAdmin,
         products: newArray,
         hasPrevPage: products.hasPrevPage,
         hasNextPage: products.hasNextPage,
         prevPage: products.prevPage,
         nextPage: products.nextPage,
         currentPage: products.page,
         totalPages: products.totalPages
      });

   } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error del servidor"
      });
   }
});

router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const cart = await cartManager.getCartById(cartId);

      if (!cart) {
         console.log("No existe el cart con el ID especificado");
         return res.status(404).json({ error: "Cart no encontrado" });
      }

      const productsInCart = cart.products.map(item => ({
         product: item.product.toObject(),
         //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
         quantity: item.quantity
      }));


      res.render("carts", { products: productsInCart });
   } catch (error) {
      console.error("Error al obtener el cart", error);
      res.status(500).json({ error: "Error del servidor" });
   }
});

// Ruta para el formulario de login
router.get("/login", (req, res) => {
   if (req.session.login) {
      return res.redirect("/products");
   }
   res.render("login");
});

// Ruta para el formulario de registro
router.get("/register", (req, res) => {
   if (req.session.login) {
      return res.redirect("/login");
   }
   res.render("register");
});


module.exports = router;
