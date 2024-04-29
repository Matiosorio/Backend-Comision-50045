const ProductModel = require("../models/product.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const UserDTO = require('../dto/user.dto.js');


class ViewsController {
    constructor() { }

    async productsView(req, res) {
        try {
            const { page = 1, limit = 3 } = req.query;
            const products = await productRepository.getProducts({
                page: parseInt(page),
                limit: parseInt(limit)
            });

            const newArray = products.docs.map(product => {
                const { _id, ...rest } = product.toObject();
                return { id: _id, ...rest };
            });

            // Verificar si el usuario es administrador
            //const isAdmin = req.session.user && req.session.user.role === "admin";

            // Verificar si el cartId está definido
            const cartId = req.session.user.cartId || null;

            // Agregar registro para imprimir el cartId
        console.log("Cart ID en el controlador de vistas:", cartId);

            // Renderizar la vista de productos con un mensaje de bienvenida diferente
            res.render("products", {
                user: req.session.user,
                //isAdmin: isAdmin,
                products: newArray,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                currentPage: products.page,
                totalPages: products.totalPages,
                cartId: cartId
            });

        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({
                status: 'error',
                error: "Error del servidor"
            });
        }
    }

    async cartsView(req, res) {
        const cartId = req.params.cid;

        console.log("ID del carrito recibido:", cartId);

        try {
            const cart = await cartRepository.getCartProducts(cartId);

            if (!cart) {
                console.log("No existe el cart con el ID especificado");
                return res.status(404).json({ error: "Cart no encontrado" });
            }

            let totalPurchase = 0

            const productsInCart = cart.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;

                totalPurchase += totalPrice;

                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            });

            // Incluye req.session.user en el contexto de datos
            res.render("carts", { cartId: cartId, products: productsInCart, user: req.session.user, totalPurchase: totalPurchase });
        } catch (error) {
            console.error("Error al obtener el cart", error);
            res.status(500).json({ error: "Error del servidor" });
        }
    }


    async getLoginView(req, res) {
        res.render("login");
    }

    async getRegisterView(req, res) {
        // if (req.session.login) {
        //     return res.redirect("/login");
        // }
        res.render("register");
    }

    async getHomeView(req, res) {
        res.render("home");
    }

    async realTimeProductsView(req, res) {
        try {
            res.render("realtimeproducts");
        } catch (error) {
            console.log("error en la vista real time", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async chatView(req, res) {
        res.render("chat");
    }

    async profileView(req, res) {
        if (!req.session.login) {
            return res.status(403).json({ error: "Acceso no autorizado" });
        }
    
        const userDTO = new UserDTO(req.session.user.first_name, req.session.user.last_name, req.session.user.role);
        res.render("profile", { user: userDTO });
    }

}

module.exports = ViewsController;