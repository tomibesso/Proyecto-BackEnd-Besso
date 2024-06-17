import { ProductService } from "../service/index.js";

class productController {
    constructor (){
        this.productService = ProductService;
    }

    getProducts = async (req, res) => {
        let { limit, numPage, sort, category, stock} = req.query
        let result = await this.productService.getProducts(limit, numPage, "price", sort, category, stock); // Obtiene todos los productos
    
        res.send(result)
    }

    getProductsById = async (req, res) => {
        const pid = req.params.pid; // Obtiene el ID del producto por params
        const product = await this.productService.getProductById(pid); // Busca el producto por su ID
    
        if (product) {
            res.send(product);
        } else {
            res.status(400).send(`El producto con ID: ${pid} no fue encontrado.`);
        }
    }

    addProduct = async (req, res) => {
        const { title, description, price, thumbnails, code, stock, category } = req.body; // Obtiene los datos del nuevo producto desde el body de la petición(req)
        
        const newProduct = await this.productService.addProduct(title, description, price, thumbnails, code, stock, category); // Agrega el nuevo producto con el método de ProductManager
    
        res.status(200).send({ status: 'success', payload: newProduct });
    }

    updateProduct = async (req, res) => {
        const {pid} = req.params; // Obtiene el ID del producto por params
        const { title, description, price, thumbnails, code, stock, category } = req.body; // Obtiene los datos de actualización del cuerpo de la solicitud
        const products = await this.productService.getProducts(); // Busca todos los productos en la base de datos
        const idExists = products.some(product => product._id.toString() === pid); // Verifica si el ID proporcionado existe en la base de datos
    
        if (!idExists) return res.send({ status: "Error", error: `No se encontró un producto con el ID: ${pid}` });
    
        const updatedProduct = await this.productService.updateProduct({_id: pid}, {title, description, price, thumbnails, code, stock, category})
        res.status(200).send(`Producto con ID ${pid} actualizado correctamente`);
    }

    deleteProduct = async (req, res) => {
        const { pid } = req.params;
        const productToDelete = await this.productService.deleteProduct({_id: pid})
    
        if(!productToDelete) {
            console.error(`Producto con ID: ${pid} no encontrado`);
            res.status(404).send(`Producto con ID: ${pid} no encontrado`)
        }
        res.status(200).send(`Producto con ID: ${pid} eliminado`);
    }
}

export default productController;