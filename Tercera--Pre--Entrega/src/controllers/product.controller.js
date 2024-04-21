const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();

class ProductController {

    async addProduct(req, res) {
        try {
            const newProduct = req.body;
            await productRepository.addProduct(newProduct);
            res.status(201).json({
                message: "Producto agregado exitosamente"
            });
        } catch (error) {
            console.error("Error al agregar un producto", error);
            res.status(500).json({ error: "Error del servidor" });
        }
    }

    async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;

            const products = await productRepository.getProducts({
                limit: parseInt(limit),
                page: parseInt(page),
                sort,
                query,
            });

            res.json({
                status: 'success',
                payload: products,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
            });

        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({
                status: 'error',
                error: "Error del servidor"
            });
        }
    }

    async getProductById(req, res) {
        try {
            const pid = req.params.pid;
            const product = await productRepository.getProductById(pid);
    
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'El producto solicitado no existe' });
        }
    }

    async updateProduct(req, res) {
        try {
            const pid = req.params.pid;
            const productUpdate = req.body;
            await productRepository.updateProduct(pid, productUpdate);
            res.json({
                message: "Producto actualizado exitosamente"
            });
        } catch (error) {
            console.error("Error al actualizar el producto", error);
            res.status(500).json({ error: "Error del servidor" });
        }
    }

    async deleteProduct(req, res) {
        try {
            const pid = req.params.pid;
            await productRepository.deleteProduct(pid);
            res.json({ message: "Producto eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            res.status(500).json({ error: "Error del servidor" });
        }
    }
}

module.exports = ProductController; 