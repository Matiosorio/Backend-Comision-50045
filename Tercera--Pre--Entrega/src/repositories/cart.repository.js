const CartModel = require("../models/cart.model.js");

class CartRepository {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error al crear un cart", error);
            throw new Error("Error al crear un cart", error);
        }
    }

    async getCartProducts(cartId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                console.log("No hay cart con el id solicitado");
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
            const cart = await this.getCartProducts(cartId);
            const productExistIndex = cart.products.findIndex(item => item.product.toString() === productId);
    
            if (productExistIndex !== -1) {
                // Si el producto ya está en el carrito, suma la cantidad
                cart.products[productExistIndex].quantity += quantity;
            } else {
                // Si el producto no está en el carrito, agrégalo con la cantidad indicada
                cart.products.push({ product: productId, quantity });
            }
    
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }
    

    async deleteCartProduct(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Cart no encontrado');
            }

            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del cart', error);
            throw error;
        }
    }

    async updateProductstInCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Cart no encontrado');
            }

            cart.products = updatedProducts;

            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al actualizar el cart', error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);
    
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            const productIndex = cart.products.findIndex(item => item._id.toString() === productId);
    
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;


                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto:', error.message);
            throw error;
        }
    }
    

    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Cart no encontrado');
            }

            return cart;
        } catch (error) {
            console.error('Error al vaciar el cart', error);
            throw error;
        }
    }
}

module.exports = CartRepository;