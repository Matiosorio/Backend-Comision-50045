const fs = require("fs").promises;

class ProductManager {

    static lastId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct({ title, description, price, thumbnail, code, stock }) {
        try {
            const arrayProducts = await this.getProducts();

            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error("Todos los campos son obligatorios");
            }

            if (arrayProducts.some(item => item.code === code)) {
                throw new Error("Error: el código ya está en uso");
            }

            const newProduct = {
                id: ++ProductManager.lastId,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }


            arrayProducts.push(newProduct);

            await this.saveFile(arrayProducts);
            return newProduct;
        } catch (error) {
            console.error("Error al agregar producto:", error.message);
            throw error;
        }
    }

    async getProducts() {
        try {
            const answer = await fs.readFile(this.path, "utf-8");
            const arrayProducts = JSON.parse(answer);
            return arrayProducts;
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si el archivo no existe, crearlo con un array vacío
                await this.saveFile([]);
                return [];
            } else {
                console.error("Error al leer el archivo:", error.message);
                return [];
            }
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find(item => item.id === id);
            if (product) {
                console.log(product);
                return product;
            } else {
                console.error("Producto no encontrado");
                throw new Error("Producto no encontrado");
            }
        } catch (error) {
            console.error("Error al obtener el producto por ID", error.message);
            throw error;
        }
    }

    async saveFile(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
        } catch (error) {
            console.error("Error al guardar el archivo", error.message);
            throw error;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(item => item.id === id);

            if (index !== -1) {
                products[index] = { ...products[index], ...updatedProduct };
                await this.saveFile(products);
                return products[index];
            } else {
                console.error("Producto no encontrado");
                throw new Error("Producto no encontrado");
            }
        } catch (error) {
            console.error("Error al actualizar el producto", error.message);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProducts();
            products = products.filter(item => item.id !== id);
            await this.saveFile(products);
            console.log("Producto eliminado");
        } catch (error) {
            console.error("Error al eliminar el producto", error.message);
            throw error;
        }
    }
}

module.exports = ProductManager;