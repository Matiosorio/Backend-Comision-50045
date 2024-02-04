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

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
}