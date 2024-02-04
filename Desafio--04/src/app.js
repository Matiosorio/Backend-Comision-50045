const express = require("express");
const app = express();
const PUERTO = 8080;

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const exphbs = require("express-handlebars");
const socket = require("socket.io");


//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const server = app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
});

//Obtener el array de productos

const ProductManager = require("./controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/products.json");

//Server socket
const io = socket(server);

//Conexión
io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    //Se envia el array al cliente
    socket.emit("products", await productManager.getProducts());

    //Evento eliminar producto lado cliente
    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        //Se envía nuevamente la vista actualizada
        io.sockets.emit("products", await productManager.getProducts());

    })

    //Agregar producto:
    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        //Nuevamente se recibe la actualización
        io.sockets.emit("products", await productManager.getProducts());
    })
})

