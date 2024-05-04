import { Router } from "express";
import { productsModel } from "../dao/models/productsModel.js";
import productManager from "../dao/ProductManagerMongo.js";

const ProductManager = new productManager();
const router = Router();

// Método(petición) para obtener todos los productos
router.get("/", async (req, res) => {
    let products = await ProductManager.getProducts(); // Obtiene todos los productos

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
router.get("/:pid", async (req, res) => {
    const pid = req.params.pid; // Obtiene el ID del producto por params
    const product = await ProductManager.getProductById(pid); // Busca el producto por su ID

    if (product) {
        res.send(product);
    } else {
        res.status(400).send(`El producto con ID: ${pid} no fue encontrado.`);
    }
});

// Método(petición) POST para agregar un nuevo producto
router.post('/', async (req, res) => {
    const { title, description, price, thumbnails, code, stock, category } = req.body; // Obtiene los datos del nuevo producto desde el body de la petición(req)
    
    const newProduct = await ProductManager.addProduct(title, description, price, thumbnails, code, stock, category); // Agrega el nuevo producto con el método de ProductManager

    res.status(200).send({ status: 'success', payload: newProduct });
});

// Método(petición) PUT para actualizar un producto existente
router.put('/:pid', async (req, res) => {
    const {pid} = req.params; // Obtiene el ID del producto por params
    const { title, description, price, thumbnails, code, stock, category } = req.body; // Obtiene los datos de actualización del cuerpo de la solicitud
    const products = await ProductManager.getProducts(); // Busca todos los productos en la base de datos
    const idExists = products.some(product => product._id.toString() === pid); // Verifica si el ID proporcionado existe en la base de datos

    if (!idExists) return res.send({ status: "Error", error: `No se encontró un producto con el ID: ${pid}` });

    const updatedProduct = await ProductManager.updateProduct({_id: pid}, {title, description, price, thumbnails, code, stock, category})
    res.status(200).send(`Producto con ID ${pid} actualizado correctamente`);
});

// Método(petición) DELETE para eliminar un producto
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productToDelete = await ProductManager.deleteProduct({_id: pid})

    if(!productToDelete) {
        console.error(`Producto con ID: ${pid} no encontrado`);
        res.status(404).send(`Producto con ID: ${pid} no encontrado`)
    }
    res.status(200).send(`Producto con ID: ${pid} eliminado`);
});

export default router;
