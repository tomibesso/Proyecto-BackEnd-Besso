process.on('exit', code => {
    console.log('Antes de ssalir de proceso', code);
})

process.on('uncaughtException', exception => {
    console.log('Este atrapa todos los errores no controlados, una variable o funcion que no exista', exception);
})

process.on('message', message => {
    console.log('Mandar mensajes a otro proceso');
})

console.log("Ejecutando codigo");
console.log(tomi);
