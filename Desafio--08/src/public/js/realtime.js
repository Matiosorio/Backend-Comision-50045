const socket = io(); 

socket.on("products", (data) => {
    productsRender(data);
})

//renderizado de productos

const productsRender = (products) => {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";

    const row = document.createElement("div");
    row.classList.add("row");

    products.docs.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card", "col-12", "col-sm-6", "col-md-4", "col-lg-3", "mb-3");

        card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">Precio: ${item.price}</p>
            <button class="btn btn-danger">Eliminar</button>
        </div>
    `;

        row.appendChild(card);

        //Evento para boton eliminar
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item._id);
        })
    });

    productsContainer.appendChild(row);
}

//Elimnar producto

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
}

//Agregar productos desde el form

document.getElementById("btnSend").addEventListener("click", () => {
    addProduct();
})

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        thumbnail: document.getElementById("thumbnail").value,
        status: document.getElementById("status").value,
    };

    socket.emit("addProduct", product);
}