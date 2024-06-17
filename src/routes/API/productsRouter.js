import { Router } from "express";
import productController from "../../controllers/productsController.js";

const router = Router();
const { getProducts, getProductsById, addProduct, updateProduct, deleteProduct} = new productController();

// Método(petición) para obtener todos los productos
router.get("/", getProducts);

// Método(petición) para obtener un producto por su ID
router.get("/:pid", getProductsById);

// Método(petición) POST para agregar un nuevo producto
router.post('/', addProduct);

// Método(petición) PUT para actualizar un producto existente
router.put('/:pid', updateProduct);

// Método(petición) DELETE para eliminar un producto
router.delete('/:pid', deleteProduct);

export default router;
