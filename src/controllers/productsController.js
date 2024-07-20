import { ProductService } from "../service/index.js";
import { productsModel } from "../dao/models/productsModel.js";
import { CustomError } from "../service/errors/customError.js";
import { generateGetProductError, generateProductError } from "../service/errors/info.js";
import { EError } from "../service/errors/enums.js";
import { isValidObjectId } from "mongoose";

class productController {
    constructor (){
        this.productService = ProductService;
        this.productsModel = productsModel
    }

    getProducts = async (req, res) => {
        let { limit, numPage, sort, category, stock } = req.query;
        try {
            let result = await this.productService.getProducts(limit, numPage, sort, category, stock);
            res.send(result);
        } catch (error) {
            req.logger.error("Error al obtener productos:", error);
            res.status(500).send("Error al obtener productos");
        }
    }
    

    getProductsById = async (req, res, next) => {
        const pid = req.params.pid; // Obtiene el ID del producto por params
        
        try {
            const product = await this.productService.getProductById(pid); // Busca el producto por su ID
            
            if (pid.length !== 24) {
                CustomError.createError({
                    name: 'Error al encontrar el producto',
                    cause: generateGetProductError({pid}),
                    message: 'Error al encontrar el producto',
                    code: EError.INVALID_PARAM
                })
                return;
            }

            if (!product) {
                res.status(401).send({status: 'error', error: 'No se encontró el producto'})
                return;
            }

            res.send(product);
        } catch (error) {
            next(error)
        }
    }

    addProduct = async (req, res, next) => {
        const { title, description, price, thumbnails, code, stock, category } = req.body; // Obtiene los datos del nuevo producto desde el body de la petición(req)

        try {
            if(!title || !description || !price || !thumbnails || !code || !stock || !category) {
                CustomError.createError({
                    name: 'Error al añadir el producto',
                    cause: generateProductError({title, description, price, thumbnails, code, stock, category}),
                    message: 'Error al añadir el producto',
                    code: EError.INVALID_TYPE_ERROR
                })
            }

            const newProduct = await this.productService.addProduct(title, description, price, thumbnails, code, stock, category); // Agrega el nuevo producto con el método de ProductManager
            res.status(200).send({ status: 'success', payload: newProduct});
        } catch (error) {
            next(error)
        }
    }

    updateProduct = async (req, res) => {
        const {pid} = req.params; // Obtiene el ID del producto por params
        const { title, description, price, thumbnails, code, stock, category } = req.body; // Obtiene los datos de actualización del cuerpo de la solicitud
        const products = await this.productsModel.find().lean(); // Busca todos los productos en la base de datos
        const idExists = products.find(product => product._id.toString() === pid); // Verifica si el ID proporcionado existe en la base de datos
    
        if (!idExists) return res.send({ status: "Error", error: `No se encontró un producto con el ID: ${pid}` });
    
        const updatedProduct = await this.productService.updateProduct({_id: pid}, {title, description, price, thumbnails, code, stock, category})
        res.status(200).send(`Producto con ID ${pid} actualizado correctamente`);
    }

    deleteProduct = async (req, res) => {
        const { pid } = req.params;
        const productToDelete = await this.productService.getProductById({_id: pid})
        if(!productToDelete) {
            req.logger.error(`Producto con ID: ${pid} no encontrado`);
            return res.status(404).send(`Producto con ID: ${pid} no encontrado`)
        }

        await this.productService.deleteProduct({_id: pid})
        res.status(200).send(`Producto con ID: ${pid} eliminado`);
    }
}

export default productController;