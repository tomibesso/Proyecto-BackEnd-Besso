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
            alert('Producto agregado al carrito.');
        } else {
            alert('Error al agregar el producto al carrito.');
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
                alert('Producto eliminado del carrito.');
                location.reload(); // Recarga la página para actualizar el carrito
            });
        } else {
            return response.json().then(data => {
                throw new Error(data.message || 'Error eliminando el producto del carrito');
            });
        }
    })
    .catch(error => console.error('Error:', error));
}