// DESAFIO ENTREGABLE 3: SERVIDOR CON EXPRESS.

// CONSIGNA: Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.

// ASPECTOS A INCLUIR: 
// ■ Se deberá utilizar la clase ProductManager que actualmente utilizamos con persistencia de archivos.
// ■ Desarrolar un servidor express que, en su archivo app.js importe el archivo de ProductManager que actualmente tenemos.
// ■ El servidor debe contar con los siguientes endpoints:
//   - ruta "/products", la cual debe leer el archivo de productos y devolverlos dentro de un objeto. Agregar el soporte para recibir
//     por query param el valor ?limit= el cual recibirá un límite de resultados. (si no se re recibe query de limites, debe mostrar
//     todos los productos, si se recibe un limite, solo se mostraran la cantidad de productos solicitados).
//   - ruta "/products/:pid", la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado,
//     en lugar de todos los productos.

// FORMATO DEL ENTREGABLE: Link al repositorio GitHub con el proyecto completo, el cual debe incluir:
//   - carpeta "src" con "app.js" y el "ProductManager" dentro.
//   - "package.json" con la info del proyecto.
//   - NO INCLUIR LOS "node_modules" generados.


import express from "express";
import http from "http";
import ProductManager from "./ProductManager.js";

const path = "./Productos.json"
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))

const instancia1 = new ProductManager(path);
const { getProducts } = new ProductManager(path)

app.get("/", (req, res) => {
    res.send("Iinicio Proyecto BackEnd")
})

app.get("/products", (req, res) => {
    let products = instancia1.getProducts();
    let { limit } = req.query;

    if(!limit) {
        res.send(products);
        return;
    }

    if (!isNaN(limit) && (limit <= 10)) {
        products = products.slice(0, limit);
        res.send(products) 
    } else res.status(400).send("El límite debe ser un numero menor o igual a 10")
})

app.get("/products/:pid", (req, res) => {
    let products = instancia1.getProducts();
    const pid = req.params.pid;
    const product = products.find(product => product.id === parseInt(pid))

    if (product) {
        res.send(product)
    } else {
        res.status(400).send(`El producto con id: ${pid} no fue encontrado.`)
    }
})


app.listen(8080, error => {
    if (error) console.log(error);
    console.log("Servidor corriendo en el puerto 8080");
})