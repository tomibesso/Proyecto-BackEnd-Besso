// implementar funcion para agregar producto al carrito

// function addToCart(productId) {
//     fetch(`/api/cart/:cid/product/${productId}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.status === 'success') {
//             alert('Producto agregado al carrito.');
//         } else {
//             alert('Error al agregar el producto al carrito.');
//         }
//     })
//     .catch(error => console.error('Error:', error));
// }

// implementar funcion para eliminar producto del carrito

// function removeFromCart(productId) {
//     fetch(`/api/carts/remove/${productId}`, {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.status === 'success') {
//             alert('Producto eliminado del carrito.');
//             location.reload(); // Recarga la página para actualizar el carrito
//         } else {
//             alert('Error al eliminar el producto del carrito.');
//         }
//     })
//     .catch(error => console.error('Error:', error));
// }