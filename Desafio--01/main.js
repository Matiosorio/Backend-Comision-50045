class ProductManager {

    static lastId = 0;

    constructor() {
        this.products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log("Error: el código ya esta en uso");
            return;
        }

        //Se crea nuevo producto

        const newProduct = {
            id: ++ProductManager.lastId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        //Se agrega el producto al array
        this.products.push(newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(item => item.id === id);

        if (!product) {
            console.error("Not found");
        } else {
            console.log(product);
        }
    }
}

// PROCESO DE TESTING

// Se creará una instancia de la clase “ProductManager”

const manager = new ProductManager();

//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log(manager.getProducts());

//Se llamará al método “addProduct” con los campos:
// title: “producto prueba”
// description:”Este es un producto prueba”
// price:200,
// thumbnail:”Sin imagen”
// code:”abc123”,
// stock:25

manager.addProduct("Producto prueba", "esto es un producto prueba", 200, "sin imagen", "abc123", 25);

//Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado

console.log(manager.getProducts());

//Validar que todos los campos sean obligatorios
manager.addProduct("Producto prueba", "esto es un producto prueba", 200, "sin imagen", "abc123");

//Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.

manager.addProduct("Producto prueba", "esto es un producto prueba", 200, "sin imagen", "abc123", 25);

//Se crean otros productos para verificar que el id se autoincrementa SIN REPETIRSE
manager.addProduct("Producto A", "Este es un producto prueba A", 200, "sin imagen", "abc124", 25);
manager.addProduct("Producto B", "Este es un producto prueba B", 200, "sin imagen", "abc125", 25);

console.log(manager.getProducts());

//Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo

console.log("Verificación ID inexistente");
manager.getProductById(5);