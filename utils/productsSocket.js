// Middleware de Socket.IO para los productos, se ejecuta antes de cada ruta
const productsSocket = (io) => {
    return (req, res, next) => {
        req.io = io; // Asigna el objeto 'io' de Socket.io a la solicitud para que esté disponible en las rutas
        return next(); // Llama a la siguiente función de middleware en la cadena
    };
};

export default productsSocket;
