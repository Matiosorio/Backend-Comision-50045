const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/CartManager-Db.js");
const cartManager = new CartManager();
const CartModel = require("../models/cart.model.js");

//Crear nuevo cart

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({error: "Error del servidor"});
    }
});

//Listar los productos que pertenecen a determinado cart

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await CartModel.findById(cartId)
            
        if (!cart) {
            console.log("No existe el cart con el id especificado");
            return res.status(404).json({ error: "Cart no encontrado" });
        }

        return res.json(cart.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(404).json({error: "Carrito no encontrado"});
    }
});

//Agregar distintos productos

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error al agregar el producto al carrito", error);
        res.status(500).json({error: "Error del servidor"});
    }
});

//Eliminar producto especifico

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.deleteCartProduct(cartId, productId);

        res.json({
            status: 'success',
            message: 'Producto eliminado correctamente del cart',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al eliminar el producto del cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Error del servidor',
        });
    }
});

//Actualizar porductos del cart

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    // Debes enviar un arreglo de productos en el cuerpo de la solicitud

    try {
        const updateCart = await cartManager.updatedCart(cartId, updatedProducts);
        res.json(updateCart);
    } catch (error) {
        console.error('Error al actualizar los productos del cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Error del servidor',
        });
    }
});

//Actualizar cantidades
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);

        res.json({
            status: 'success',
            message: 'Cantidad actualizada correctamente del producto',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al actualizar la cantidad', error);
        res.status(500).json({
            status: 'error',
            error: 'Error del servidor',
        });
    }
});

//Vaciado de cart

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        const updatedCart = await cartManager.emptyCart(cartId);

        res.json({
            status: 'success',
            message: 'No quedan productos en el cart',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al vaciar el cart', error);
        res.status(500).json({
            status: 'error',
            error: 'Error del servidor',
        });
    }
});


module.exports = router;