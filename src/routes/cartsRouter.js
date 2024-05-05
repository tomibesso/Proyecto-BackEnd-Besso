import { Router } from "express";
import CartManager from "../dao/CartManagerMongo.js";

const router = Router();
const cartManager = new CartManager(); // instanciamos la clase CartManager


// Método(petición) POST para agregar un nuevo carrito
router.post('/', async (req, res) => {
    const newCart = await cartManager.addCart(); // Utiliza el metodo para agregar un carrito de la clase CartManager
    res.status(200).send({ status: 'success', cart: newCart });
});

// Método(petición) que obtiene un carrito por ID pasado por params
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid; // Obtiene el ID del carrito de los parámetros de la solicitud
    const cart = await cartManager.getCartById(cartId); // Utiliza el método para obtener el carrito por su ID

    if (!cart) { // verifica si el carrito existe
        res.status(404).send({ status: 'error', message: 'No se encontró el carrito' });
        return;
    }

    if (cart.products.length === 0) { // verifica si el carrito contiene productos
        console.error(`El carrito con ID ${cartId} no tiene productos`);
        res.status(404).send({ status: 'error', message: 'El carrito no tiene productos' });
        return;
    }

    res.status(200).send({ status: 'success', products: cart.products });
});


// Método(petición) POST para agregar un producto por ID a un carrito por ID
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid; // Pasa a numero el params pasado
    const productId = req.params.pid; // Pasa a numero el params pasado
    const addProduct = await cartManager.addProductToCart(cartId, productId); // Utiliza el metodo de CartManager para agregar el producto al carrito
    if (addProduct) {
        res.status(200).send({ status: 'success', message: 'Producto agregado al carrito' });
    } else {
        res.status(404).send({ status: 'error', message: 'No se pudo agregar el producto al carrito' });
    }
});

export default router;
