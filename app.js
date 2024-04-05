import express from "express";
import productsRouter from "./routes/productsRouter.js";
import { __dirname } from "./utils.js";
import { uploader } from "./multer.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("static", express.static(__dirname + "/public"));

app.use('/subir-archivo', uploader.single('myFile') ,(req, res) => {
    if (!req.file) {
        return res.send('no se puede subir el archivo')        
    }

    res.send('archivo subido')
})

app.get("/", (req, res) => {
    res.send("Iinicio Proyecto BackEnd")
})

app.use(productsRouter)

app.use('/api/products', productsRouter);

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).send('Error 500 en el server')
})

app.listen(8080, error => {
    if (error) console.log(error);
    console.log("Servidor corriendo en el puerto 8080");
})