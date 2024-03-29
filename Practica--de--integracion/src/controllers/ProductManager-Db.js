const ProductModel = require("../models/product.model.js");

class ProductManager {
    async addProduct({ title, description, price, thumbnail, code, stock, category }) {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                throw new Error("Todos los campos son obligatorios");
            }

            const productExists = await ProductModel.findOne({ code: code });

            if (productExists) {
                throw new Error("El código debe ser único");
            }

            const newProduct = new ProductModel({
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category,
                thumbnail: thumbnail || []
            });

            await newProduct.save();
        } catch (error) {
            console.log("Error al agregar un producto", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const products = await ProductModel.find();
            return products;
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto encontrado");
            return product;
        } catch (error) {
            console.log("Error al obtener el producto por Id", error);
            throw error;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const productUpdated = await ProductModel.findByIdAndUpdate(id, updatedProduct);

            if (!productUpdated) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto actualizado");
            return productUpdated;
        } catch (error) {
            console.log("Error al actualizar producto por id", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);

            if (!deletedProduct) {
                throw new Error("Producto no encontrado");
            }
            console.log("Producto eliminado");
            return deletedProduct;

        } catch (error) {
            console.log("Error al eliminar por id", error);
            throw error;
        }
    }
}

module.exports = ProductManager;