const socket = io()
let user // Guarda el mail del usuario ingresado por input de sweet alert

// Alerta que pide mail del usuario
Swal.fire({
    title: 'Identifícate',
    input: 'email',
    text: 'Ingresa tu mail para identificarte en el chat',
    inputValidator: value => { // Valida que el valor ingresado sea un correo electrónico válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el formato de correo electrónico
        
        if (!value || !emailRegex.test(value)) { // Verifica si el valor ingresado coincide con el formato de correo electrónico
            return 'Ingresa un correo electrónico válido para continuar';
        }
    },
    allowOutsideClick: false // Impide que se clickee afuera del recuadro de sweet alert
})
.then(result => {
    user = result.value; // Guarda el valor del input en la variable user
})

let chatBox = document.querySelector('#chatBox') // Guarda en la variable el input donde escribo los mensajes

// Evento que envía el mensaje cuando se aprieta la tecla "Enter"
chatBox.addEventListener('keyup', evt => {
    if(evt.key === 'Enter'){
        if(chatBox.value.trim().length > 0 ){ // Verifica que el input no esté vacío y en caso de haber mensaje, elimina los espacios al inicio y final del texto
            socket.emit('message', { user, message: chatBox.value }) // Envía(emit) un objeto con el mensaje al servidor "app.js"
            chatBox.value = '' // Vacía el contenido del input despues de enviar el mensaje
        }
    }

})

// Escucha(on) el evento 'messageLogs' que proviene del servidor
socket.on('messageLogs', data => {
    let log = document.getElementById('messageLog') // Selecciona el elemento (li) donde se mostrarán los mensajes

    let messages = '' // Almacena los mensajes
    data.forEach(message => {
        // Formatea el mensaje con el nombre de usuario del remitente y el contenido del mensaje
        messages += `<li>${message.user}: ${message.message}</li><br>`
    })
    // Actualiza el contenido del registro de mensajes con los mensajes formateados
    log.innerHTML = messages
})
