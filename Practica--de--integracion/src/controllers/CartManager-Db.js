const CartModel = require("../models/cart.model.js");

class CartManager {
    async createCart () {
        try {
            const newCart = new CartModel({products: []});
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error al crear un cart", error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);

            if(!cart) {
                console.log("No hat cart con el id solicitado");
                return null;
            }


            return cart;
        } catch (error) {
            console.log("Error al obtener cart por id", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const productExist = cart.products.find(item => item.product.toString() === productId);

            if(productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({product: productId, quantity});
            }

            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }
}

module.exports = CartManager;

