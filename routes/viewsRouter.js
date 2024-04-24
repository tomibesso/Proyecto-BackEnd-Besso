import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import { Server, Socket } from "socket.io";

const router = Router();
const path = "./Productos.json"

const instanciaProducts = new ProductManager(path);
const products = instanciaProducts.getProducts();

const user = {
    username: "Tomibesso",
    name: "Tomi",
    lastName: "Besso",
    role: "admin"
}

router.get("/", (req, res) => {
    res.render("home", {
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        role: user.role === 'admin',
        title: 'E-Commerce Tomi Besso',
        products,
        styles: "productsStyles.css"
    })
})

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", {
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        role: user.role === 'admin',
        title: 'E-Commerce Tomi Besso',
        products,
        styles: "productsStyles.css",
    })
})

router.get('/chat', (req, res) => {
    const io = req

    io.on('connection', socket => {
        console.log('nuevo cliete conectado')
    
        const messages = []
    
        // enviar mensajes viejos
    
        io.on('mensaje_cliente', data => {
            console.log(data)
    
            messages.push({id: socket.id, messge: data})
            
            io.emit('messages_server', messages)
        })
    })

    res.render('chat', {
        styles: 'homeStyles.css' })
})

export default router;