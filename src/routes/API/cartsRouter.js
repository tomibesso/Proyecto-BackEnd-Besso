import { Router } from "express";
import cartController from "../../controllers/cartsController.js";
import { authorization } from "../../utils/authorizationJWT.js";
import optionalAuth from "../../middlewares/optionalAuth.js";

const router = Router();
const { addCart, getCartById, addProductToCart, deleteProductsFromCart, updateCart, updateProductQuantity, deleteAllProducts, purchaseProducts } = new cartController();

// Método(petición) POST para agregar un nuevo carrito
router.post('/', optionalAuth, authorization('user', 'premium'), addCart);

// Método(petición) GET que obtiene un carrito por ID pasado por params
router.get('/:cid', optionalAuth, authorization('user', 'premium'), getCartById);

// Método(petición) POST para agregar un producto por ID a un carrito por ID
router.post('/:cid/product/:pid', optionalAuth, authorization('user', 'premium'), addProductToCart);

// Método(petición) DELETE para eliminar un producto por ID a un carrito por ID
router.delete('/:cid/products/:pid', optionalAuth, authorization('user', 'premium'), deleteProductsFromCart);

// Método(petición) PUT para actualizar el carrito con un array de productos con el formato del objeto del GET
router.put('/:cid', optionalAuth, authorization('user', 'premium'), updateCart);

// Método(petición) PUT para actualizar la quantity de un producto
router.put('/:cid/products/:pid', optionalAuth, authorization('user', 'premium'), updateProductQuantity);

// Método(petición) DELETE para eliminar todos los productos de un carrito
router.delete('/:cid', optionalAuth, authorization('user', 'premium'), deleteAllProducts)

// Método(petición) POST para eliminar todos los productos de un carrito
router.post('/:cid/purchase', optionalAuth, authorization('user', 'premium'), purchaseProducts)




export default router;
