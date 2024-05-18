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
    const { limit, numPage, sort, category, stock} = req.query
    const result = await productsService.getProducts(limit, numPage, "price", sort, category, stock); // Obtiene todos los productos

    res.render("home", { // Renderiza la pantilla de "home.hbs" la cual tiene los datos del usuario y los productos
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        role: user.role === 'admin',
        title: 'E-Commerce Tomi Besso',
        products: result.payload,
        styles: "productsStyles.css"
    })
})

// Método(petición) para mostrar el usuario y productos (se actualiza solo con websockets)
router.get("/realtimeproducts", async (req, res) => {
    const { limit, numPage, sort, category, stock} = req.query
    const result = await productsService.getProducts(limit, numPage, "price", sort, category, stock); // Obtiene todos los productos
    
    res.render("realTimeProducts", { // Renderiza la pantilla de "realTimeProducts.hbs" la cual tiene los datos del usuario y los productos
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        role: user.role === 'admin',
        title: 'E-Commerce Tomi Besso',
        produresultcts: result.payload,
        styles: "productsStyles.css",
    })
})

// Método(petición) para mostrar el chat
router.get('/chat', (req, res) => {
    res.render('chat', { // Renderiza la plantilla "chat.hbs"
        styles: './public/css/chatStyles.css' })
})

router.get('/products', async (req, res) => {
    const { limit, numPage, sort, category, stock} = req.query
    const result = await productsService.getProducts(limit, numPage, "price", sort, category, stock); // Obtiene todos los productos
    console.log(result);

    res.render('products', {
        products: result.payload,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
        page: result.page
    })
})

router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params
    const result = await productsService.getProductById(pid)

    res.render('productDetail', {
        title: result.title,
        descirption: result.description,
        price: result.price,
        code: result.code,
        stock: result.stock,
        category: result.category
    }
    )
})

export default router;