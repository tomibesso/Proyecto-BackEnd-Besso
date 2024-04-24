import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const path = "./Productos.json"
const instancia1 = new ProductManager(path);

router.get("/", (req, res) => {
    let products = instancia1.getProducts();
    let { limit } = req.query;

    if(!limit) {
        res.send(products);
        return;
    }

    if (!isNaN(limit) && (limit <= 10)) {
        products = products.slice(0, limit);
        res.send(products) 
    } else res.status(400).send("El límite debe ser un numero menor o igual a 10")
})

router.get("/:pid", (req, res) => {
    let products = instancia1.getProducts();
    const pid = req.params.pid;
    const product = products.find(product => product.id === parseInt(pid))

    if (product) {
        res.send(product)
    } else {
        res.status(400).send(`El producto con id: ${pid} no fue encontrado.`)
    }
})

router.post('/', (req, res) => {
    const { title, description, price, thumbnails, code, stock, category } = req.body;
    instancia1.addProduct(title, description, price, thumbnails, code, stock, category);

    res.status(200).send({ status: 'success', payload: req.body })
});

router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updateData = req.body;
    instancia1.updateProduct(productId, updateData);

    res.status(200).send(`Producto con ID ${productId} actualizado correctamente`);
});

router.delete('/:id', (req, res) => {
    const productToDelete = parseInt(req.params.id);
    instancia1.deleteProduct(productToDelete);

    res.status(200).send("Producto eliminado");

});

export default router;