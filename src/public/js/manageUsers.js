document.getElementById('infoBtn').addEventListener('click', async () => {
    const userMail = document.getElementById('userMail').value;

    if (!userMail) {
        alert("Por favor, ingrese un email.");
        return;
    }
    try {
        const response = await fetch(`/api/users/mail?email=${userMail}`, { method: 'GET' });
        const result = await response.json()

        if (result.status === 'Success') {
                displayInfo(result.payload)
            } else {
                alert("Error en la solicitud o Usuario no encontrado")
        }
    } catch (error) {
        console.error(error);
    }
})

function displayInfo(user) {
    const userInfoDiv = document.getElementById('userInfo')

    userInfoDiv.innerHTML = '';

    const userDetails = `
        <p><strong>Nombre:</strong> ${user.firstName}</p>
        <p><strong>Apellido:</strong> ${user.lastName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Edad:</strong> ${user.age}</p>
        <p><strong>Rol:</strong> ${user.role}</p>
        <p><strong>Ultima conexión:</strong> ${user.last_connection}</p>
        <p><strong>ID del Usuario:</strong> ${user._id}</p>
        <p><strong>ID del Carrito:</strong> ${user.cartId}</p>
    `;

    userInfoDiv.innerHTML = userDetails;
}

document.getElementById('roleBtn').addEventListener('click', async () => {
    const userMail = document.getElementById('userMail').value;

    if (!userMail) {
        alert("Por favor, ingrese un email.");
        return;
    }
    try {
        const response = await fetch(`/api/users/mail?email=${userMail}`, { method: 'GET' });
        const result = await response.json()
        
        if(!response.ok) {
            alert("Error en la solicitud o Usuario no encontrado")
        }

        const userId = result.payload._id

        const response2 = await fetch(`/api/users/premium/${userId}`, { method: 'PUT' })
        const result2 = await response2.json()

        if(result2.status === 'Success') {
            alert('Rol cambiado exitosamente')
        } else {
            alert('Error al procesar la solicitud')
        }
    } catch (error) {
        console.error(error);
    }
})

document.getElementById('deleteBtn').addEventListener('click', async () => {
    const userMail = document.getElementById('userMail').value;

    if (!userMail) {
        alert("Por favor, ingrese un email.");
        return;
    }
    try {
        const response = await fetch(`/api/users/mail?email=${userMail}`, { method: 'GET' });
        const result = await response.json()
        
        if(!response.ok) {
            alert("Error en la solicitud o Usuario no encontrado")
        }

        const userId = result.payload._id

        const response2 = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
        const result2 = await response2.json()

        if(result2.status === 'Success') {
            alert('Usuario eliminado exitosamente')
        } else {
            alert('Error al procesar la solicitud')
        }
    } catch (error) {
        console.error(error);
    }
})

document.getElementById('deleteInactivesBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/users', { method: 'DELETE' })
        const result = await response.json()

        if(result.status) {
            alert(result.payload)
        } else {
            alert('Error al procesar la solicitud')
        }
    } catch (error) {
        console.error(error);
    }
})