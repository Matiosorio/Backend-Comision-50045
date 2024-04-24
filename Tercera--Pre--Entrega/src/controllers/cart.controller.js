const UserModel = require("../models/user.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();

class CartController {
    async newCart(req, res) {
        try {
            const newCart = await cartRepository.createCart();
            res.json(newCart);
        } catch (error) {
            console.error("Error al crear un nuevo carrito", error);
            res.status(500).json({ error: "Error del servidor" });
        }
    }

    async getCartProducts(req, res) {
        const cartId = req.params.cid;
        try {
            const products = await cartRepository.getCartProducts(cartId);
            if (!products) {
                return res.status(404).json({ error: "Cart no encontrado" });
            }
            res.json(products);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        try {
            const updateCart = await cartRepository.addProductToCart(cartId, productId, quantity);
            res.redirect(`/carts/${cartId}`)
        } catch (error) {
            console.error("Error al agregar el producto al carrito", error);
            res.status(500).json({ error: "Error del servidor" });
        }
    }

    async deleteCartProduct(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;

            const updatedCart = await cartRepository.deleteCartProduct(cartId, productId);

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
    }

    async updateProductsInCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;

        try {
            const updateCart = await cartRepository.updateProductstInCart(cartId, updatedProducts);
            res.json(updateCart);
        } catch (error) {
            console.error('Error al actualizar los productos del carrito', error);
            res.status(500).json({
                status: 'error',
                error: 'Error del servidor',
            });
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const newQuantity = req.body.quantity;

            const updatedCart = await cartRepository.updateProductQuantity(cartId, productId, newQuantity);

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
    }

    async emptyCart(req, res) {
        try {
            const cartId = req.params.cid;
            const updatedCart = await cartRepository.emptyCart(cartId);

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
    }

    async finalizePurchase(req, res) {
        const cartId = req.params.cid;
        try {
            // Obtener el carrito y sus productos
            const cart = await cartRepository.getCartById(cartId);
            const products = cart.products;

            // Inicializar un arreglo para almacenar los productos no disponibles
            const unavailableProducts = [];

            // Verificar el stock y actualizar los productos disponibles
            for (const item of products) {
                const productId = item.productId; // Ajustar según el modelo de datos
                const product = await productRepository.getProductById(productId);
                if (product.stock >= item.quantity) {
                    // Si hay suficiente stock, restar la cantidad del producto
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    // Si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
                    unavailableProducts.push(productId);
                }
            }

            // Crear un ticket con los datos de la compra
            const ticket = new TicketModel({
                code: generateUniqueCode(), // Implementar según corresponda
                purchaseDateTime: new Date(),
                amount: calculateTotal(cart.products), // Implementar según corresponda
                purchaser: cart.userId // Ajustar según el modelo de datos
            });
            await ticket.save();

            // Eliminar del carrito los productos que sí se compraron
            cart.products = cart.products.filter(item => !unavailableProducts.includes(item.productId));

            // Guardar el carrito actualizado en la base de datos
            await cart.save();

            res.status(200).json({ unavailableProducts });
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = CartController;