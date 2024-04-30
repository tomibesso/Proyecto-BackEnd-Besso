import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();


// Método(petición) POST para agregar un nuevo carrito
router.post('/', (req, res) => {
    const newCart = cartManager.addCart(); // Utiliza el metodo para agregar un carrito de la clase CartManager
    res.status(200).send({ status: 'success', cart: newCart });
});

// Método(petición) que obtiene un carrito por ID pasado por params
router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid); // Pasa a numero el params pasado
    const products = cartManager.getProductsFromCart(cartId); // Utiliza el método para obtener un carrito por ID de la clase CartManager
    if (products.length > 0) { // Valida que exista al menos un producto en el carrito
        res.status(200).send({ status: 'success', products });
    } else {
        res.status(404).send({ status: 'error', message: 'No se encontraron productos en el carrito' });
    }
});

// Método(petición) POST para agregar un producto por ID a un carrito por ID
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid); // Pasa a numero el params pasado
    const productId = parseInt(req.params.pid); // Pasa a numero el params pasado
    const success = cartManager.addProductToCart(cartId, productId); // Utiliza el metodo de CartManager para agregar el producto al carrito
    if (success) {
        res.status(200).send({ status: 'success', message: 'Producto agregado al carrito' });
    } else {
        res.status(404).send({ status: 'error', message: 'No se pudo agregar el producto al carrito' });
    }
});

export default router;
