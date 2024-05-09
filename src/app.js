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
import { productsModel } from "./dao/models/productsModel.js";
import { messagesModel } from "./dao/models/messagesModel.js"
import { connectDb } from './config/index.js'

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

// ejecuto la funcion para conectarme a la base de datos
connectDb();

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
io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    const products = await productsModel.find({})

    socket.emit('productos', products); // envía(emit) los productos a través del socket "productos" que recibe socket.on("productos") en home.js
});

// inicia conexión de Socket.IO (handshake) para el chat
io.on('connection', socket => {
    console.log('Cliente conectado')
    // Escucha(on) los mensajes enviados(emit) por "chat.js"
    socket.on('message', async data => {
        console.log('message data: ', data);

        try {
            // Guarda el nuevo mensaje en la base de datos
            await messagesModel.create({
                user: data.user,
                message: data.message
            });

            // Emite el evento "messageLogs" con los mensajes actualizados al cliente
            const messages = await messagesModel.find(); // Obtén todos los mensajes de la base de datos
            socket.emit('messageLogs', messages); // Envía los mensajes al cliente para actualizar la interfaz de usuario
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        }
    });
});