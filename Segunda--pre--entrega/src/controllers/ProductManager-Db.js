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

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const productos = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }

        /* try {
            const products = await ProductModel.find();
            return products;
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        } */
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