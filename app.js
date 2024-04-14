import express from "express";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import { uploader } from "./multer.js";
import handlebars from "express-handlebars"

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine)

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
app.use('/handlebars', viewsRouter);

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).send('Error 500 en el server')
})

app.listen(8080, error => {
    if (error) console.log(error);
    console.log("Servidor corriendo en el puerto 8080");
})