import express from "express";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import { Server } from "socket.io"
import { __dirname } from "./utils.js";
import productsSocket from "./utils/productsSocket.js";
import { uploader } from "./multer.js";
import handlebars from "express-handlebars";
import ProductManager from "./ProductManager.js";

const app = express();

const httpServer = app.listen(8080, error => {
    if(error) console.log(error)
    console.log('Server escuchando en el puerto 8080')
})

const io = new Server(httpServer)

app.use(productsSocket(io))

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Obtén los productos del ProductManager
    const productManager = new ProductManager();
    const products = productManager.getProducts();

    // Envía los productos al cliente conectado
    socket.emit('productos', products);
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("static", express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine())

app.set("views", __dirname+"/views")
app.set("view engine", "handlebars")

app.use('/subir-archivo', uploader.single('myFile') ,(req, res) => {
    if (!req.file) {
        return res.send('no se puede subir el archivo')        
    }

    res.send('archivo subido')
})

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).send('Error 500 en el server')
})