import { Router } from "express";
import ProductManager from "../dao/ProductManagerFS.js";

const router = Router();
const path = "./Productos.json";
const instancia1 = new ProductManager(path); // Crea una instancia de ProductsManager

// Método(petición) para obtener todos los productos
router.get("/", (req, res) => {
    let products = instancia1.getProducts(); // Obtiene todos los productos
    let { limit } = req.query; // Obtiene el parámetro de consulta "limit"

    // Si no se proporciona un límite, devuelve todos los productos
    if (!limit) {
        res.send(products);
        return;
    }

    // Si se proporciona un límite válido, devuelve una cantidad específica de productos
    if (!isNaN(limit) && (limit <= 10)) {
        products = products.slice(0, limit);
        res.send(products);
    } else {
        res.status(400).send("El límite debe ser un número menor o igual a 10");
    }
});

// Método(petición) para obtener un producto por su ID
router.get("/:pid", (req, res) => {
    let products = instancia1.getProducts(); // Obtiene todos los productos
    const pid = req.params.pid; // Obtiene el ID del producto por params
    const product = products.find(product => product.id === parseInt(pid)); // Busca el producto por su ID

    if (product) {
        res.send(product);
    } else {
        res.status(400).send(`El producto con ID: ${pid} no fue encontrado.`);
    }
});

// Método(petición) POST para agregar un nuevo producto
router.post('/', (req, res) => {
    const { title, description, price, thumbnails, code, stock, category } = req.body; // Obtiene los datos del nuevo producto desde el body de la petición(req)
    instancia1.addProduct(title, description, price, thumbnails, code, stock, category); // Agrega el nuevo producto con el metodo de ProductManager

    res.status(200).send({ status: 'success', payload: req.body });
});

// Método(petición) PUT para actualizar un producto existente
router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id); // Obtiene el ID del producto por params
    const updateData = req.body; // Obtiene los datos de actualización del cuerpo de la solicitud
    instancia1.updateProduct(productId, updateData); // Actualiza el producto usando el metodo de ProductManager

    res.status(200).send(`Producto con ID ${productId} actualizado correctamente`);
});

// Método(petición) DELETE para eliminar un producto
router.delete('/:id', (req, res) => {
    const productToDelete = parseInt(req.params.id); // Obtiene el ID del producto por params
    instancia1.deleteProduct(productToDelete); // Elimina el producto usando el método de ProductManager

    res.status(200).send("Producto eliminado");
});

export default router;
