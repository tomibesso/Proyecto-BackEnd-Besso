import { Router } from "express";
import ProductManager from "../dao/Mongo/ProductDAOMongo.js";
import CartManager from "../dao/Mongo/CartDAOMongo.js"
import userManager from "../dao/Mongo/UserDAOMongo.js";
import { auth } from "../middlewares/authMiddleware.js";
import { authTokenMiddleware } from "../utils/jsonwebtokens.js";
import optionalAuth from "../middlewares/optionalAuth.js"
import passport from 'passport';
import { passportCall }  from "../utils/passportCall.js";
import { authorization } from "../utils/authorizationJWT.js";

const router = Router();

const productsService = new ProductManager(); // Crea una instancia de ProductManager
const cartService = new CartManager(); // Crea una instancia de CartManager
const userService = new userManager(); // Crea una instancia de UserManager

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
        products: result.payload,   
        styles: "productsStyles.css",
    })
})

// Método(petición) para mostrar el chat
router.get('/chat', (req, res) => {
    res.render('chat', { // Renderiza la plantilla "chat.hbs"
        styles: './public/css/chatStyles.css' })
})

router.get('/', (req, res) => {
    res.redirect('/products')
})

router.get('/products', optionalAuth, async (req, res) => {
    const { limit, numPage, sort, category, stock } = req.query;
    const result = await productsService.getAll(limit, numPage, "price", sort, category, stock); // Obtiene todos los productos

    try {
        let user = null;
        if (req.user) {
            const userMail = req.user.user.email;
            user = await userService.getBy({ email: userMail });
        }

        res.render('products', {
            products: result.payload,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage,
            prevLink: result.prevLink,
            nextLink: result.nextLink,
            page: result.page,
            title: "E-Commerce Tomi - Productos",
            styles: "./public/css/productsStyles.css",
            user: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", message: "Error al cargar los productos" });
    }
});

router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params
    const result = await productsService.getById(pid)

    res.render('productDetail', {
        id: pid,
        productTitle: result.title,
        descirption: result.description,
        price: result.price,
        code: result.code,
        stock: result.stock,
        category: result.category,
        title: "E-Commerce Tomi - Detalle"
    }
    )
})

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params
    const result = await cartService.getById(cid)

    if (!result) {
        return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.render('cart', {
        cart: result.products,
        productId: result.products._id,
        cartId: result.cartId,
        title: "E-Commerce Tomi - Carrito",
    })
})

router.get('/register', (req, res) => {
    if(req.cookies['TomiCookieToken']) return res.send("Ya estas logueado");
    res.render('register', {
        title: "E-Commerce Tomi - Registrarse"
    })
})

router.get('/login', (req, res) => {
    if(req.cookies['TomiCookieToken']) return res.send("Ya estas logueado");
    res.render('login', {
        title: "E-Commerce Tomi - Loguearse"
    })
})

router.get('/profile', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), async (req, res) => {
    if (req.user) {        
        try {
            const email = req.user.user.email;
            const user = await userService.getBy({email})
            
            if (!user) {
                return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
            }
    
            res.render('profile', {
                user,
                title: "E-Commerce Tomi - Perfil"
            });
        } catch (error) {
            console.error("Error al obtener perfil del usuario", error);
        }
    } else {
        res.redirect('login')
    }
})

router.get('/users', passportCall('jwt'), authorization('admin'), async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || 'asc';
    const sortProperty = req.query.sortProperty || 'lastName';

    const usersData = await userService.getAll(limit, page, sortProperty, sort); 
    res.render('users', {
        users: usersData,
        title: "E-Commerce Tomi - Usuarios"
    });
})

export default router;