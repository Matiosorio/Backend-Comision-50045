const ProductModel = require("../models/product.model.js");

class ProductManager {
    async addProduct({title, description, price, thumbnail, code, stock, category}) {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock || !category ) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const productExists = await ProductModel.findOne({code: code});

            if(productExists) {
                console.log("El coidigo debe ser unico");
                return;
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

    async getProducts () {
        try {
            const products = await ProductModel.find();
            return products;
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    async getProductById (id) {
        try {
            const product = await ProductModel.findById(id);
            if(!product) {
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

           if(!productUpdated) {
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

    async deleteProduct (id) {
        try {
            const deleteProduct= await ProductModel.findByIdAndDelete(id);
 
            if(!deleteProduct) {
             console.log("Producto no encontrado");
             return null;
            }
            console.log("Producto eliminado");

         } catch (error) {
             console.log("Error al eliminar por id", error);
             throw error;
         }
    }
}

module.exports = ProductManager;