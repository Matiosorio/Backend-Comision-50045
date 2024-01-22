const express = require("express");
const app = express();
const PUERTO = 8080;

const ProductManager = require("./ProductManager.js");
const productManager = new ProductManager("./src/products.json");

app.use(express.json());

//Se lee el archivo de productos y los devuelve. Se agrega soporte para recibir por query param el valor ?limit= 

app.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit; // Obtén el límite de la consulta si se proporciona
        const products = await productManager.getProducts();

        if(limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.log("Error al obtener los productos", error);
        res.status(500).json({ error: 'Error del servidor' });
    }
})

//Traer un solo producto por ID

app.get('/products/:pid', async (req, res) => {
    let pid = req.params.pid;

    try {
        const product = await productManager.getProductById(parseInt(pid));
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'El producto solicitado no existe' });
    }
});

app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost${PUERTO}`);
});