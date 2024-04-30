
import express from "express";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import { Server } from "socket.io"
import { __dirname } from "./utils.js";
import productsSocket from "./utils/productsSocket.js";
import { uploader } from "./multer.js";
import handlebars from "express-handlebars";
import ProductManager from "./managers/ProductManager.js";
import mongoose from "mongoose";

const app = express();

// Defino el puerto del servidor
const PORT = process.env.PORT || 8080

// Creación del servidor HTTP y conexión del servidor de sockets (Socket.IO)
const httpServer = app.listen(PORT, error => {
    if(error) console.log(error)
    console.log('Server escuchando en el puerto 8080')
})
const io = new Server(httpServer)

//  Configuración de la conexión del servidor de sockets con el manager de productos
app.use(productsSocket(io))

// Configuración de middlewares para el manejo de: datos JSON, URLencoded y archivos estáticos
app.use(express.json()); // Convierte los datos JSON en un objeto Javascript
app.use(express.urlencoded({extended:true})); // permite que Express analice y decodifique los datos de formularios HTML 
app.use(express.static(__dirname + "/public")); // Define la ruta de la carpeta /public para definir archivos estaticos


// conectar con mongo (despues se lleva a otro archivo)
mongoose.connect("mongodb+srv://tomibesso:tomi2024@clusterecommercetomi.auhhpid.mongodb.net/miPrimeraDB?retryWrites=true&w=majority&appName=ClusterEcommerceTomi")


// Configuración del motor de plantillas Handlebars
app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))
app.set("views", __dirname+"/views")
app.set("view engine", "hbs")

// Ruta para subir archivos
app.use('/subir-archivo', uploader.single('myFile') ,(req, res) => {
    if (!req.file) {
        return res.send('no se puede subir el archivo')        
    }
    
    res.send('archivo subido')
})

// Configuración de las rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);
app.use('/', viewsRouter);

// Manejo de errores del servidor
app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).send('Error 500 en el server')
})

// inicia conexión de Socket.IO (handshake) para el manager de productos
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    const productManager = new ProductManager();
    const products = productManager.getProducts();

    socket.emit('productos', products); // envía(emit) los productos a través del socket "productos" que recibe socket.on("productos") en home.js
});

let messages = [] 

// inicia conexión de Socket.IO (handshake) para el chat
io.on('connection', socket => {
    console.log('Cliente conectado')

    socket.on('message', data => { // Recibe(on) el mensaje desde "chat.js"
        console.log('message data: ', data)
        messages.push(data) // guarda los mensajes en array "messages"
        socket.emit('messageLogs', messages) // envía(emit) los mensajes a través del socket "messageLogs" que recibe socke.on("messageLogs") en chat.js
    })
})