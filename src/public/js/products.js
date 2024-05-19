// implementar funcion para agregar producto al carrito

function addToCart(productId) {
    fetch(`/api/carts/66365f682bbd296adfa43a01/product/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            Toastify({
                text: "Producto agregado al carrito",
                duration: 2000,
                gravity: "top",
                position: "left",
                style: {
                  background: "linear-gradient(to right, #1ECE1B, #69D96C)",
                  border: "2px solid black",
                  borderRadius: "5px"
                },
              }).showToast();
        } else {
            Toastify({
                text: "Error al agregar el producto al carrito.",
                duration: 2000,
                gravity: "top",
                position: "left",
                style: {
                  background: "linear-gradient(to right, #FF0101, #FF6B6B)",
                  border: "2px solid black",
                  borderRadius: "5px"
                },
              }).showToast();
        }
    })
    .catch(error => console.error('Error:', error));
}

// implementar funcion para eliminar producto del carrito

function removeFromCart(productId) {
    console.log(`saco producto ${productId}`);
    fetch(`/api/carts/66365f682bbd296adfa43a01/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) { // Verificar si la respuesta HTTP es un estado exitoso (2xx)
            return response.json().then(data => {
                Toastify({
                    text: "Producto eliminado del carrito",
                    duration: 2000,
                    gravity: "top",
                    position: "left",
                    style: {
                      background: "linear-gradient(to right, #1ECE1B, #69D96C)",
                      border: "2px solid black"
                    },
                  }).showToast();
                setTimeout(() => {location.reload()}, 2000); // Recarga la página para actualizar el carrito
            });
        } else {
            return response.json().then(data => {
                throw new Error(data.message || 'Error eliminando el producto del carrito');
            });
        }
    })
    .catch(error => console.error('Error:', error));
}