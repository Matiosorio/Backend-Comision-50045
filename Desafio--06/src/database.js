const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://matiasosorio:coderhouse@cluster0.loeu3rw.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conexion exitosa"))
    .catch(() => console.log("Error en la conexion"))
