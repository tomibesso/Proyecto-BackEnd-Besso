import express from "express";
import cookieParser from 'cookie-parser'
import session from 'express-session';
import passport from "passport";
import { Server } from "socket.io"
import handlebars from "express-handlebars";

import routerApp from "./routes/index.js"
import { initializePassport } from "./config/passportConfig.js";
import { __dirname } from "./utils.js";
import productsSocket from "./utils/productsSocket.js";
import { productsModel } from "./dao/models/productsModel.js";
import { messagesModel } from "./dao/models/messagesModel.js"
import { connectDb, objectConfig } from './config/index.js'
import MongoStore from 'connect-mongo';

const app = express();
const { port, mongoURL, cookieParserSign, sessionKey } = objectConfig;
 
// Creación del servidor HTTP y conexión del servidor de sockets (Socket.IO)
const httpServer = app.listen(port, error => {
    if(error) console.log(error)
    console.log(`Server escuchando en el puerto ${port}`)
})
const io = new Server(httpServer)

//  Configuración de la conexión del servidor de sockets con el manager de productos
app.use(productsSocket(io))

// Configuración de middlewares para el manejo de: datos JSON, URLencoded y archivos estáticos
app.use(express.json()); // Convierte los datos JSON en un objeto Javascript
app.use(express.urlencoded({extended:true})); // permite que Express analice y decodifique los datos de formularios HTML 
app.use(express.static(__dirname + "/public")); // Define la ruta de la carpeta /public para definir archivos estaticos

app.use(cookieParser(cookieParserSign))
app.use(session({
    store: MongoStore.create({
        mongoUrl: mongoURL,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 60*60*24
    }),
    secret: sessionKey,
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// ejecuto la funcion para conectarme a la base de datos
connectDb();

// Configuración del motor de plantillas Handlebars
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))
app.set("views", __dirname+"/views")
app.set("view engine", "hbs")

app.use(routerApp)

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