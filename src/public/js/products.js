// implementar funcion para agregar producto al carrito

async function addToCart(cartId, productId) {
     await fetch(`/api/carts/${cartId}/product/${productId}`, {
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

async function removeFromCart(cartId, productId) {
    console.log(`saco producto ${productId}`);
    await fetch(`/api/carts/${cartId}/products/${productId}`, {
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
                    duration: 1000,
                    gravity: "top",
                    position: "left",
                    style: {
                      background: "linear-gradient(to right, #1ECE1B, #69D96C)",
                      border: "2px solid black"
                    },
                  }).showToast();
                setTimeout(() => {location.reload()}, 1000); // Recarga la página para actualizar el carrito
            });
        } else {
            return response.json().then(data => {
                throw new Error(data.message || 'Error eliminando el producto del carrito');
            });
        }
    })
    .catch(error => console.error('Error:', error));
}

async function purchase(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Compra realizada',
                text: 'Tu compra ha sido finalizada exitosamente!',
                html: `
                        <h3>Se enviara un mail con el ticket de compra</h3>
                    `,
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload()
                }
            })
        } else if (result.status === 'info') {
            Swal.fire({
                icon: 'info',
                title: 'Sin productos',
                text: result.message,
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload()
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error en la compra',
                text: result.message || 'Hubo un problema al realizar la compra.',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload()
                }
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error en la compra',
            text: 'Hubo un problema al realizar la compra.',
            confirmButtonText: 'OK'
        });
        console.error('Error:', error);
    }
}
