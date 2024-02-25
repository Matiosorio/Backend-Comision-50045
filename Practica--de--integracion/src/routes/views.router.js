const express = require("express");
const router = express.Router(); 

router.get("/", async (req, res) => {
    res.render("chat");
 })

// const ProductManager = require("../controllers/ProductManager.js");
// const productManager = new ProductManager("./src/models/products.json");

// router.get("/", async (req, res) => {
//     try {
//         const products = await productManager.getProducts();

//         res.render("home", {products})
//     } catch (error) {
//         console.log("Error al obtener los productos", error);
//         res.status(500).json({error: "Error del servidor"});
//     }
// })

// router.get("/realtimeproducts", async (req, res) => {
//     try {
//         res.render("realtimeproducts");
//     } catch (error) {
//         console.log("Error en la vista", error);
//         res.status(500).json({error: "Error del servidor"});
//     }
// })

module.exports = router;