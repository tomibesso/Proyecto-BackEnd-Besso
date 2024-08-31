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
        } else if (data.message === 'Los usuarios premium no pueden agregar sus propios productos al carrito') {
            Toastify({
                text: "Los usuarios premium no pueden agregar sus propios productos al carrito.",
                duration: 2000,
                gravity: "top",
                position: "left",
                style: {
                  background: "linear-gradient(to right, #FF0101, #FF6B6B)",
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

async function createProduct(event) {

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const thumbnails = document.getElementById('thumbnails').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;

    const newUser = {
        title: title,
        description: description,
        price: price,
        thumbnails: thumbnails,
        code: code,
        stock: stock,
        category: category
    };

    try {   
        const response = await fetch(`/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        console.log('Respuesta del servidor al crear producto:', response)

        if (response.ok) {
            alert("Producto creado")
        } else {
            alert("No se pudo crear el producto")
        }
    } catch (error) {
        console.error("Error al crear el producto", error);
    }
}

async function updateProduct(event) {
    event.preventDefault();

    const productId = document.getElementById('productId').value;

    const title = document.getElementById('updateTitle').value;
    const description = document.getElementById('updateDescription').value;
    const price = document.getElementById('updatePrice').value;
    const thumbnails = document.getElementById('updateThumbnails').value;
    const code = document.getElementById('updateCode').value;
    const stock = document.getElementById('updateStock').value;
    const category = document.getElementById('updateCategory').value;

    const updatedProduct = {};
    if (title) updatedProduct.title = title;
    if (description) updatedProduct.description = description;
    if (price) updatedProduct.price = price;
    if (thumbnails) updatedProduct.thumbnails = thumbnails;
    if (code) updatedProduct.code = code;
    if (stock) updatedProduct.stock = stock;
    if (category) updatedProduct.category = category;

    try {   
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        });

        if (response.ok) {
            alert("Producto actualizado")
        } else {
            alert("No se pudo actualizar el producto")
        }
    } catch (error) {
        console.error("Error al actualizar el producto", error);
    }
}

async function deleteProduct(event) {
    const pid = document.getElementById('product_Id').value;

    try {
        const response = await fetch(`/api/products/${pid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            alert("Producto eliminado")
        } else {
            alert("No se pudo eliminar el producto")
        }
    } catch (error) {
        console.error("Error al eliminar el producto", error);
    }
}
