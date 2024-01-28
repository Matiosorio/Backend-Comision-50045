const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.lastId = 0;

        //cargar los carritos almacenados
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if(this.carts.length > 0) {
                //verifica si hay un carrito creado
                this.lastId = Math.max(...this.carts.map(cart => cart.id));
                //metodo map para crear un nuevo array que solo tenga los identificadores del carrito y con Math.max se obtiene el mayor
            }
        } catch (error) {
            console.error("Error al cargar los carritos", error);
            // Si no existe el archivo lo crea
            await this.loadCarts();
        }
    }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

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

    async getCartById(cartId) {
        try {
            const cart = this.carts.find(c => c.id === cartId);

            if(!cart) {
                throw new Error (`No existe un carrito con el id ${cartId} `);
            }
            return cart;

        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const realProduct = cart.products.find(p => p.product === productId);

        if(realProduct) {
            realProduct.quantity += quantity;
        } else {
            cart.products.push({product: productId, quantity});
        }

        await this.saveCarts();
        return cart;
    }
}

module.exports = CartManager

