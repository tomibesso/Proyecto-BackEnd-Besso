import { Router } from "express";
import CartManager from "../CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.post('/', (req, res) => {
    const newCart = cartManager.addCart();
    res.status(200).send({ status: 'success', cart: newCart });
});

router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const products = cartManager.getProductsFromCart(cartId);
    if (products.length > 0) {
        res.status(200).send({ status: 'success', products });
    } else {
        res.status(404).send({ status: 'error', message: 'No se encontraron productos en el carrito' });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const success = cartManager.addProductToCart(cartId, productId);
    if (success) {
        res.status(200).send({ status: 'success', message: 'Producto agregado al carrito' });
    } else {
        res.status(404).send({ status: 'error', message: 'No se pudo agregar el producto al carrito' });
    }
});

export default router;
