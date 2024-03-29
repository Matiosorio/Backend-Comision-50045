const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/ProductManager-Db.js");
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit; // Obtiene el límite de la consulta si se proporciona
        const products = await productManager.getProducts();

        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.log("Error al obtener los productos", error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

//Traer un solo producto por ID

router.get("/:pid", async (req, res) => {
    let pid = req.params.pid;

    try {
        const product = await productManager.getProductById(pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'El producto solicitado no existe' });
    }
});

//Agregar un nuevo producto:

router.post("/", async (req, res) => {
    const newProduct = req.body;
    
    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({
            message: "Producto agregado exitosamente"
        });
    } catch (error) {
        console.error("Error al agregar un producto", error);
        res.status(500).json({error: "Error del servidor"});
    }
});

//Actualizar producto por ID
router.put("/:pid", async (req, res) => {
    const pid = req.params.pid;
    const productUpdate = req.body;

    try {
        await productManager.updateProduct(pid, productUpdate);
        res.json({
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.error("Error al actuzalizar el producto", error);
        res.status(500).json({error: "Error del serividor"});
    }
});

//Eliminar Producto:
router.delete("/:pid", async (req, res) => {
    const pid = req.params.pid;
    
    try {
        await productManager.deleteProduct(pid);
        res.json({message: "Producto eliminado exitosamente"});
    } catch (error) {
        console.error("Error al eliminar el producto", error);
        res.status(500).json({error: "Error del servidor"});
    }
});

module.exports = router;

