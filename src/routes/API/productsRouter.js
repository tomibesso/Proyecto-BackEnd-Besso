import { Router } from "express";
import productController from "../../controllers/productsController.js";
import { authorization } from "../../utils/authorizationJWT.js";
import optionalAuth from "../../middlewares/optionalAuth.js";

const router = Router();
const { getProducts, getProductsById, addProduct, updateProduct, deleteProduct} = new productController();

// Método(petición) para obtener todos los productos
router.get("/", getProducts);

// Método(petición) para obtener un producto por su ID
router.get("/:pid", getProductsById);

// Método(petición) POST para agregar un nuevo producto
router.post('/', optionalAuth, authorization('premium', 'admin'), addProduct);

// Método(petición) PUT para actualizar un producto existente
router.put('/:pid', optionalAuth, authorization('premium', 'admin'), updateProduct);

// Método(petición) DELETE para eliminar un producto
router.delete('/:pid', optionalAuth, authorization('premium', 'admin'), deleteProduct);

export default router;