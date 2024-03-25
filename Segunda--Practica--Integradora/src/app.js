const express = require("express");
const session = require("express-session");
const app = express();
const PUERTO = 8080;

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const handlebars = require("express-handlebars");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const socket = require("socket.io");
const MongoStore = require("connect-mongo");
//const { initialize } = require("passport");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");
require("./database.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(session({
    secret:"secretCoder",
    resave: true, 
    saveUninitialized:true,   
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://matiasosorio:coderhouse@cluster0.loeu3rw.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })
}))

//Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
});

