const socket = io();

socket.on("products", (data) => {
    productsRender(data);
})

//renderizado de productos

const productsRender = (products) => {
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.innerHTML = "";

    products.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
                        <p> ${item.id} </>
                        <p> ${item.title} </>
                        <p> ${item.price} </>
                        <br>
                        <button> Eliminar </button>
                        `;
        productsContainer.appendChild(card);

        //Evento para boton eliminar
        card.querySelector("button").addEventListener("click", ()=> {
            deleteProduct(item.id);
        })
    })
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
