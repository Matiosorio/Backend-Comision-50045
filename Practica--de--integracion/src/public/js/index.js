const socket = io();

let user; 
const chatBox = document.getElementById("chatBox");

Swal.fire({
    title: "Identificate", 
    input: "text",
    text: "Ingresa un usuario para identificarte en el chat", 
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre para continuar"
    }, 
    allowOutsideClick: false,
}).then( result => {
    user = result.value;
})

chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            //trim nos permite sacar los espacios en blanco del principio y del final de un string. 
            //Si el mensaje tiene más de 0 caracteres, lo enviamos al servidor. 
            socket.emit("message", {user: user, message: chatBox.value}); 
            chatBox.value = "";
        }
    }
})

socket.on("message", data => {
    let log = document.getElementById("messagesLogs");
    let messages = "";

    data.forEach( message => {
        messages = messages + `${message.user} dice: ${message.message} <br>`
    })

    log.innerHTML = messages;
})



// socket.on("products", (data) => {
//     productsRender(data);
// })

// //renderizado de productos

// const productsRender = (products) => {
//     const productsContainer = document.getElementById("productsContainer");
//     productsContainer.innerHTML = "";

//     const row = document.createElement("div");
//     row.classList.add("row");

//     products.forEach(item => {
//         const card = document.createElement("div");
//         card.classList.add("card", "col-12", "col-sm-6", "col-md-4", "col-lg-3", "mb-3");

//         card.innerHTML = `
//         <div class="card-body">
//             <h5 class="card-title">${item.title}</h5>
//             <p class="card-text">ID: ${item.id}</p>
//             <p class="card-text">Precio: ${item.price}</p>
//             <button class="btn btn-danger">Eliminar</button>
//         </div>
//     `;

//         row.appendChild(card);

//         //Evento para boton eliminar
//         card.querySelector("button").addEventListener("click", () => {
//             deleteProduct(item.id);
//         })
//     });

//     productsContainer.appendChild(row);
// }

// //Elimnar producto

// const deleteProduct = (id) => {
//     socket.emit("deleteProduct", id);
// }

// //Agregar productos desde el form

// document.getElementById("btnSend").addEventListener("click", () => {
//     addProduct();
// })

// const addProduct = () => {
//     const product = {
//         title: document.getElementById("title").value,
//         description: document.getElementById("description").value,
//         code: document.getElementById("code").value,
//         price: document.getElementById("price").value,
//         stock: document.getElementById("stock").value,
//         category: document.getElementById("category").value,
//         thumbnail: document.getElementById("thumbnail").value,
//         status: document.getElementById("status").value,
//     };

//     socket.emit("addProduct", product);
// }


