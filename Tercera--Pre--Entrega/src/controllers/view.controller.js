const ProductModel = require("../models/product.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();


class ViewsController {
    constructor() {} 

    async getProductsView(req, res) {
        try {
            if (!req.session.login) {
                return res.redirect("/login");
            }

            const { page = 1, limit = 3 } = req.query;
            const products = await productRepository.getProducts({
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
    }

    async getCartsView(req, res) {
        const cartId = req.params.cid;

        try {
            const cart = await cartRepository.getCartById(cartId);

            if (!cart) {
                console.log("No existe el cart con el ID especificado");
                return res.status(404).json({ error: "Cart no encontrado" });
            }

            const productsInCart = cart.products.map(item => ({
                product: item.product.toObject(),
                quantity: item.quantity
            }));

            res.render("carts", { products: productsInCart });
        } catch (error) {
            console.error("Error al obtener el cart", error);
            res.status(500).json({ error: "Error del servidor" });
        }
    }

    getLoginView(req, res) {
        if (req.session.login) {
            return res.redirect("/products");
        }
        res.render("login");
    }

    getRegisterView(req, res) {
        if (req.session.login) {
            return res.redirect("/login");
        }
        res.render("register");
    }

    async renderHome(req, res) {
        res.render("home");
    }
    
}

module.exports = ViewsController;