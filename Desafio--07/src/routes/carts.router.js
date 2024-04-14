const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/CartManager-Db.js");
const cartManager = new CartManager();
const CartModel = require("../models/cart.model.js");

// Crear nuevo carrito
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

// Listar los productos de un carrito
router.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CartModel.findById(cartId);

        if (!cart) {
            console.log("No existe el carrito con el ID especificado");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(cart.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(404).json({ error: "Carrito no encontrado" });
    }
});

// Agregar productos al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error al agregar el producto al carrito", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

// Eliminar producto específico del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.deleteCartProduct(cartId, productId);

        res.json({
            status: 'success',
            message: 'Producto eliminado correctamente del carrito',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error del servidor',
        });
    }
});

// Actualizar productos del carrito
router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
        const updateCart = await cartManager.updatedCart(cartId, updatedProducts);
        res.json(updateCart);
    } catch (error) {
        console.error('Error al actualizar los productos del carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error del servidor',
        });
    }
});

// Actualizar cantidades de productos en el carrito
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);

        res.json({
            status: 'success',
            message: 'Cantidad actualizada correctamente del producto en el cart',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Error del servidor',
        });
    }
});

// Vaciar carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const updatedCart = await cartManager.emptyCart(cartId);

        res.json({
            status: 'success',
            message: 'No quedan productos en el carrito',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al vaciar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error del servidor',
        });
    }
});

module.exports = router;
