import { Router } from "express";
import cartController from "../../controllers/cartsController.js";

const router = Router();
const { addCart, getCartById, addProductToCart, deleteProductsFromCart, updateCart, updateProductQuantity, deleteAllProducts } = new cartController();

// Método(petición) POST para agregar un nuevo carrito
router.post('/', addCart);

// Método(petición) GET que obtiene un carrito por ID pasado por params
router.get('/:cid', getCartById);

// Método(petición) POST para agregar un producto por ID a un carrito por ID
router.post('/:cid/product/:pid', addProductToCart);

// Método(petición) DELETE para eliminar un producto por ID a un carrito por ID
router.delete('/:cid/products/:pid', deleteProductsFromCart);

// Método(petición) PUT para actualizar el carrito con un array de productos con el formato del objeto del GET
router.put('/:cid', updateCart);

// Método(petición) PUT para actualizar la quantity de un producto
router.put('/:cid/products/:pid', updateProductQuantity);

// Método(petición) DELETE para eliminar todos los productos de un carrito
router.delete('/:cid', deleteAllProducts)




export default router;
