const fs = require("fs").promises;

class ProductManager {

    static lastId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct({ title, description, price, thumbnail, code, stock }) {
        try {
            const arrayProducts = await this.getProducts();

            if (!title || !description || !price || !thumbnail || !code || !stock) {
                throw new Error("Todos los campos son obligatorios");
            }

            if (arrayProducts.some(item => item.code === code)) {
                throw new Error("Error: el código ya está en uso");
            }

            const newProduct = {
                id: ++ProductManager.lastId,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }

            arrayProducts.push(newProduct);

            await this.saveFile(arrayProducts);
            return newProduct;
        } catch (error) {
            console.error("Error al agregar producto:", error.message);
            throw error;
        }
    }

    async getProducts() {
        try {
            const answer = await fs.readFile(this.path, "utf-8");
            const arrayProducts = JSON.parse(answer);
            console.log(JSON.stringify(arrayProducts));
            return arrayProducts;
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si el archivo no existe, crearlo con un array vacío
                await this.saveFile([]);
                return [];
            } else {
                console.error("Error al leer el archivo:", error.message);
                return [];
            }
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find(item => item.id === id);
            if (product) {
                console.log(product);
                return product;
            } else {
                console.error("Producto no encontrado");
                throw new Error("Producto no encontrado");
            }
        } catch (error) {
            console.error("Error al obtener el producto por ID", error.message);
            throw error;
        }
    }

    async saveFile(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
        } catch (error) {
            console.error("Error al guardar el archivo", error.message);
            throw error;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(item => item.id === id);

            if (index !== -1) {
                products[index] = { ...products[index], ...updatedProduct };
                await this.saveFile(products);
                return products[index];
            } else {
                console.error("Producto no encontrado");
                throw new Error("Producto no encontrado");
            }
        } catch (error) {
            console.error("Error al actualizar el producto", error.message);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProducts();
            products = products.filter(item => item.id !== id);
            await this.saveFile(products);
            console.log("Producto eliminado");
        } catch (error) {
            console.error("Error al eliminar el producto", error.message);
            throw error;
        }
    }
}


//PROCESO DE TESTING:

// Crea una instancia de la clase ProductManager

const manager = new ProductManager('./products.json');

// Productos para usar en la función

const additionalProducts = [
    {
        title: 'producto prueba 1',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc123',
        stock: 25,
    },
    {
        title: 'producto prueba 2',
        description: 'Este es un producto prueba',
        price: 500,
        thumbnail: 'Sin imagen',
        code: 'abc124',
        stock: 25,
    },
    {
        title: 'producto prueba 3',
        description: 'Este es un producto prueba',
        price: 1000,
        thumbnail: 'Sin imagen',
        code: 'abc125',
        stock: 25,
    },
];

//INICIO TESTING
async function runTests() {
    //Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []

    const productsAtStart = await manager.getProducts();
    console.log(productsAtStart.length === 0 ? 'Éxito' : 'Fallo');

    // Se llamara al metodo "addProduct" con campos especificados
    // El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE

    try {
        for (const productData of additionalProducts) {
            const addedProduct = await manager.addProduct(productData);
            console.log('Producto agregado:', addedProduct);
        }
    } catch (error) {
        console.error('Error al agregar productos', error.message);
    }

    // Se llama al método “getProducts” nuevamente
    const productsAfterAddition = await manager.getProducts();
    console.log('Productos después de la adición:', productsAfterAddition);

    //Se llama a getProductById con ID existente
    try {
        // Obtener el producto con ID existente
        const productWithId1 = await manager.getProductById(1);
        console.log('Éxito al obtener el producto por ID:', productWithId1);
    } catch (error) {
        console.error('Error al obtener el producto por ID', error.message);
    }

    //Se llama a getProductById con ID inexistente
    try {
        // Obtener el producto con ID inexistente
        await manager.getProductById(111);
        console.log('Fallo: El error es esperado ya que el producto no existe');//Se esperea un error ya que el producto no existe
    } catch (error) {
        console.error('Éxito: Al intentar obtener un producto inexistente');
    }

    // Llamada a updateProduct para cambiar un campo
    try {
        // Obtengo un producto con ID existente
        const productWithId1 = await manager.getProductById(1);

        // Actualizo el producto
        const updatedProduct = await manager.updateProduct(1, {
            price: 250,  // Cambiar el precio
            stock: 30    // Cambiar el stock
        });

        console.log('Producto actualizado:', updatedProduct);

        // Verifico que el ID no se haya eliminado
        console.log('ID después de la actualización:', updatedProduct.id);

        // Obtengo el producto actualizado por ID
        const updatedProductById = await manager.getProductById(1);
        console.log('Producto actualizado por ID:', updatedProductById);
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message);
    }

    // Llamo a deleteProduct para eliminar el producto

    try {
        const productIdToDelete = 1;
        // Eliminar el producto
        await manager.deleteProduct(productIdToDelete);
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
    }
}
// Se llama a la función
runTests();




