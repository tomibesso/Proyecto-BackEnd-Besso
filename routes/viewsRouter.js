import { Router } from "express";
import ProductManager from "../ProductManager.js";
import productsSocket from "../utils/productsSocket.js";

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

export default router;