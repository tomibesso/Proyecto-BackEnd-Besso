import { Router } from "express";
import ProductManager from "../dao/ProductManagerMongo.js";

const router = Router();

const productsService = new ProductManager(); // Crea una instancia de ProductManager

const user = {
    username: "Tomibesso",
    name: "Tomi",
    lastName: "Besso",
    role: "admin"
}

// Método(petición) para mostrar el usuario y productos (no se actualiza solo)
router.get("/home", async (req, res) => {
    const products = await productsService.getProducts(limit = 10, numPage = 1, sortProperty = "price", sort, category, stock); // Guarda en la const los productos con el método de ProductManager

    res.render("home", { // Renderiza la pantilla de "home.hbs" la cual tiene los datos del usuario y los productos
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        role: user.role === 'admin',
        title: 'E-Commerce Tomi Besso',
        products,
        styles: "productsStyles.css"
    })
})

// Método(petición) para mostrar el usuario y productos (se actualiza solo con websockets)
router.get("/realtimeproducts", async (req, res) => {
    const products = await productsService.getProducts(limit = 10, numPage = 1, sortProperty = "price", sort, category, stock); // Guarda en la const los productos con el método de ProductManager
    
    res.render("realTimeProducts", { // Renderiza la pantilla de "realTimeProducts.hbs" la cual tiene los datos del usuario y los productos
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        role: user.role === 'admin',
        title: 'E-Commerce Tomi Besso',
        products,
        styles: "productsStyles.css",
    })
})

// Método(petición) para mostrar el chat
router.get('/chat', (req, res) => {
    res.render('chat', { // Renderiza la plantilla "chat.hbs"
        styles: './public/css/chatStyles.css' })
})

router.get('/products', async (req, res) => {
    const products = await productsService.getProducts(); // Guarda en la const los productos con el método de ProductManager
    console.log(products);

    res.render('products', {
        products: products.payload
    })
})

export default router;