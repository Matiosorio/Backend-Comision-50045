const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.lastId = 0;

        //Metodo para cargar los carts
        this.loadCarts();
    }

    //Metodo para cargar los carts
    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.lastId = Math.max(...this.carts.map(cart => cart.id));
                //Comprueba si hay carts. Si los hay, mapea para crear un nuevo array que contenga solo los id. Math.max encuentra el mayor.
            }
        } catch (error) {
            console.error("Error al cargar los carritos", error);
            await this.loadCarts();
        }
    }

    //Guardar el estado actual de los carts
    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    //Crear un nuevo cart y guardarlo
    async createCart() {
        const newCart = {
            id: ++this.lastId,
            products: []
        };

        this.carts.push(newCart);

        //Guardar el array
        await this.saveCarts();
        return newCart;
    }

    //Obtener un cart por Id
    async getCartById(cartId) {
        try {
            const cart = this.carts.find(cartItem => cartItem.id === cartId);

            if (!cart) {
                throw new Error(`No existe un carrito con el id ${cartId} `);
            }
            return cart;

        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    //Agrega un producto a un cart existente o lo crea si no existe
    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const foundProduct = cart.products.find(product => product.product === productId);

        if (foundProduct) {
            foundProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.saveCarts();
        return cart;
    }
}

module.exports = CartManager

