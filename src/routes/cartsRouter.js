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

// Método(petición) DELETE para eliminar un producto por ID a un carrito por ID
router.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid; // Pasa a numero el params pasado
    const productId = req.params.pid; // Pasa a numero el params pasado
    const deleteProduct = await cartManager.deleteProductsFromCart(cartId, productId);
    if(deleteProduct) {
        res.status(200).send({ status: 'success', message: 'Producto eliminado del carrito exitosamente'})
    } else {
        res.status(400).send({ status: 'error', message: 'El producto no pudo ser eliminado'});
    }
});

// Método(petición) PUT para actualizar el carrito con un array de productos con el formato del objeto del GET
router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const newProducts = req.body.products; // Suponiendo que los productos se envían en el cuerpo de la solicitud bajo la clave "products"

    try {
        const updatedCart = await cartManager.updateCart(cartId, newProducts);

        if (updatedCart) {
            return res.status(200).json({
                status: "success",
                payload: updatedCart,
                message: "Carrito actualizado exitosamente"
            });
        } else {
            return res.status(404).json({
                status: "error",
                message: "El carrito no se encontró"
            });
        }
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error al procesar la solicitud"
        });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity; // Envio por body el campo "quantity" con el numero actualizado

    try {
        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);

        return res.status(200).json({
            status: "success",
            payload: updatedCart,
            message: "Cantidad del producto actualizada exitosamente en el carrito"
        });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito:", error);
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error al procesar la solicitud"
        });
    }
});

router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid

    try {  
        const result = await cartManager.deleteAllProducts(cartId)
    
        res.status(200).send({status: "sucess", payload: result, message: "Productos borrados del carrito"});
    } catch (error) {
        console.error("Error al eliminar los productos del carrito");
        res.status(500).send({status: "Error", message: "Error al eliminar los productos"})
    }
})




export default router;
