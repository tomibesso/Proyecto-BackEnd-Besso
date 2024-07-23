import { productsModel } from "../models/productsModel.js";
import { devLogger, prodLogger } from "../../utils/loggers.js";

const logger = process.env.LOGGER === 'production' ? prodLogger : devLogger

export default class productManager {
    // Método para agregar un nuevo producto 
    async create(title, description, price, thumbnails, code, stock, category) {
        try {
            // Guarda el nuevo producto en la base de datos
            const newProduct = await productsModel.create({
                title,
                description,
                price,
                thumbnails,
                code,
                stock,
                category
            });
            logger.info("Producto agregado correctamente:", newProduct);
            return newProduct
        } catch (error) {
            logger.error("Error al agregar producto:", error);
        }
    }

    // Método para obtener todos los productos
    async getAll(limit = 10, numPage = 1, sortProperty = "price", sort, category, stock) {
        try {
            let sortOption = {}; // Objeto para el ordenamiento
    
            // Si se proporciona el parámetro sort y es "asc" o "desc", se configura el objeto de ordenamiento
            if (sort && (sort === "asc" || sort === "desc")) {
                sortOption = { [sortProperty]: sort };
            }

            let query = {}; // Query para filtrar los productos

            // Si se proporciona la categoría, se agrega a la consulta
            if (category ) {
                query.category = category;
            }
            // Si se proporciona el stock, se agrega a la consulta
            if (stock) {
            query.stock = stock;
            }
    
            // Obtiene todos los productos de la base de datos
            const { docs, page, totalDocs, hasPrevPage, hasNextPage } = await productsModel.paginate(query, {
                limit: limit,
                page: numPage,
                sort: sortOption, // Se aplica el ordenamiento según corresponda
                lean: true
            });

            const totalPages = Math.ceil(totalDocs / parseInt(limit));

            const baseUrl = '/products';

            const prevLink = hasPrevPage ? `${baseUrl}?numPage=${page - 1}` : null;
            const nextLink = hasNextPage ? `${baseUrl}?numPage=${page + 1}` : null;

            return {
                status: "success",
                payload: docs,
                totalPages: totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink
            };

        } catch (error) {
            logger.error("Error al obtener productos:", error);
            return [];
        }
    }    
    

    // Método para obtener un producto por ID
    async getById(id) {
        try {
            // Busca un producto por su ID en la base de datos
            const product = await productsModel.findById(id).lean();
            if (!product) {
                logger.error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            logger.error("Error al obtener producto por ID:", error);
        }
    }

    // Método para actualizar un producto existente
    async update(id, updateData) {
        try {
            // Busca y actualiza el producto por su ID en la base de datos
            const updatedProduct = await productsModel.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedProduct) {
                logger.error("Producto no encontrado");
            }
            logger.info("Producto actualizado correctamente:", updatedProduct);
            return updatedProduct;
        } catch (error) {
            logger.error("Error al actualizar producto:", error);
        }
    }

    // Método para eliminar el producto por ID
    async delete(id) {
        try {
            // Elimina un producto por su ID de la base de datos
            const deletedProduct = await productsModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                logger.error("Producto no encontrado");
            }
            logger.info("Producto eliminado correctamente:", deletedProduct);
        } catch (error) {
            logger.error("Error al eliminar producto:", error);
        }
    }
}
