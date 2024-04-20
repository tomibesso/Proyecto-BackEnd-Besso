const socket = io();
socket.on("productos", (data) => {
    console.log(data);
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = ""; // Limpiar contenido anterior
    data.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("col-md-4", "mb-4");
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
        productContainer.appendChild(card);
    });
});