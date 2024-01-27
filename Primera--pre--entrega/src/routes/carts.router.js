const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager("./src/models/carts.json");

//Crear nuevo carrito

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({error: "Error del servidor"});
    }
});

//Listar los productos que pertenecen a determinado carrito.

router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({error: "Errro del servidor"});
    }
});