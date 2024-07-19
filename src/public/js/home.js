import { devLogger, prodLogger } from '../../utils/loggers.js'

const logger = process.env.LOGGER === 'production' ? prodLogger : devLogger
const socket = io();

// Escucha(on) los productos recibidos desde el servidor "app.js"
socket.on("productos", (data) => {
    logger.info(data); // Se muestra por consola el array de productos
    const productContainer = document.getElementById("product-container"); // Selecciona el <div> donde se mostraran los productos
    productContainer.innerHTML = ""; // Limpiar contenido anterior

    // Bucle que crea un <div> por cada producto del array
    data.forEach((product) => {
        const card = document.createElement("div"); // Crea el <div> que representa una tarjeta de producto
        card.classList.add("col-md-4", "mb-4"); // Agrega las clases al <div>

        // Se establece el HTML interno del <div> de cada producto con toda su informacion
        card.innerHTML = `
                <div class="card">
                    <img src="${product.thumbnails}" class="card-img-top" alt="Product Image">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">Price: ${product.price}</p>
                        <p class="card-text">Code: ${product.code}</p>
                        <p class="card-text">Stock: ${product.stock}</p>
                        <p class="card-text">Category: ${product.category}</p>
                    </div>
                </div>
            `;

        // Se agrega el <div> de la tarjeta de cada producto al contenedor "product-container"
        productContainer.appendChild(card);
    });
});