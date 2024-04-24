const io = req

const input = document.getElementById('message')
const messageList = document.getElementById('list-message')

input.addEventListener('keyup', evt => {
    if(evt.key === 'Enter'){
        io.emit('mensaje_cliente', input.value)
        input.value= ''
    }
})
// manager create get
io.on('messages_server', data => {
    console.log(data)
})
