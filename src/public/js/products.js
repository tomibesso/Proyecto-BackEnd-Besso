function addToCart(productId) {
    fetch(`/api/cart/:cid/product/${productId}`, {
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

function caca() {
    alert("Hola")
}