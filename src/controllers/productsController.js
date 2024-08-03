import { ProductService } from "../service/index.js";
import { productsModel } from "../dao/models/productsModel.js";
import { CustomError } from "../service/errors/customError.js";
import { generateGetProductError, generateProductError } from "../service/errors/info.js";
import { EError } from "../service/errors/enums.js";

class productController {
    constructor (){
        this.productService = ProductService;
        this.productsModel = productsModel;
    }

    getProducts = async (req, res) => {
        let { limit, numPage, sort, category, stock } = req.query;
        try {
            let result = await this.productService.getProducts(limit, numPage, sort, category, stock);
            res.status(200).send(result);
        } catch (error) {
            req.logger.error("Error al obtener productos:", error);
            res.status(500).send("Error al obtener productos");
        }
    }

    getProductsById = async (req, res, next) => {
        const pid = req.params.pid;
        try {
            const product = await this.productService.getProductById(pid);
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
                res.status(401).send({status: 'error', error: 'No se encontró el producto'});
                return;
            }

            res.status(200).send(product);
        } catch (error) {
            res.status(500).send("Error al obtener productos");
            next(error);
        }
    }

    addProduct = async (req, res, next) => {      
        try {
            const { title, description, price, thumbnails, code, stock, category } = req.body;

            if(!title || !description || !price || !thumbnails || !code || !stock || !category) {
                CustomError.createError({
                    name: 'Error al añadir el producto',
                    cause: generateProductError({title, description, price, thumbnails, code, stock, category}),
                    message: 'Error al añadir el producto',
                    code: EError.INVALID_TYPE_ERROR
                })
            }

            const ownerId = req.user.user.id || "admin";

            const newProductData = {
                title,
                description,
                price,
                thumbnails,
                code,
                stock,
                category,
                owner: ownerId
            };

            const newProduct = await this.productService.addProduct(newProductData);
            res.status(201).send({ status: 'success', payload: newProduct });
        } catch (error) {
            next(error);
            res.status(500).send("Error en el servidor");            
        }
    }

    updateProduct = async (req, res) => {
        try {
            const { pid } = req.params;
            const { title, description, price, thumbnails, code, stock, category } = req.body;
            const userId = req.user.user._id;
            const userRole = req.user.user.role;
    
            const product = await this.productService.getProductById(pid);
            if (!product) {
                return res.status(404).json({ status: "Error", error: `No se encontró un producto con el ID: ${pid}` });
            }
    
            if (userRole !== 'admin' && product.owner.toString() !== userId.toString()) {
                return res.status(403).json({ status: "Error", error: "No tienes permisos para actualizar este producto" });
            }
    
            const updatedProduct = await this.productService.updateProduct(pid, { title, description, price, thumbnails, code, stock, category });
            res.status(200).json({ status: "Success", message: `Producto con ID ${pid} actualizado correctamente`, updatedProduct });
        } catch (error) {
            req.logger.error(error);
            res.status(500).json({ status: "Error", error: "Error interno del servidor" });
        }
    }
    

    deleteProduct = async (req, res) => {
        try {
            const { pid } = req.params;
            const userId = req.user.user.id;
            const userRole = req.user.user.role;
    
            const product = await this.productService.getProductById(pid);
            if (!product) {
                req.logger.error(`Producto con ID: ${pid} no encontrado`);
                return res.status(404).json({ status: "Error", error: `Producto con ID: ${pid} no encontrado` });
            }
    
            if (userRole !== 'admin' && product.owner.toString() !== userId) {
                return res.status(403).json({ status: "Error", error: "No tienes permisos para eliminar este producto" });
            }
    
            await this.productService.deleteProduct(pid);
            res.status(200).json({ status: "Success", message: `Producto con ID: ${pid} eliminado correctamente` });
        } catch (error) {
            req.logger.error(`Error eliminando el producto con ID: ${pid}`, error);
            res.status(500).json({ status: "Error", error: "Error interno del servidor" });
        }
    }
    
}

export default productController;
