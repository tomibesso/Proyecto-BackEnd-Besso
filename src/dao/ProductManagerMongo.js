import { productsModel } from "./models/productsModel.js";

export default class productManager {
    // Método para agregar un nuevo producto 
    async addProduct(title, description, price, thumbnails, code, stock, category) {
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
            console.log("Producto agregado correctamente:", newProduct);
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    }

    // Método para obtener todos los productos
    async getProducts() {
        try {
            // Obtiene todos los productos de la base de datos
            const products = await productsModel.find();
            return products;
        } catch (error) {
            console.error("Error al obtener productos:", error);
            return [];
        }
    }

    // Método para obtener un producto por ID
    async getProductById(id) {
        try {
            // Busca un producto por su ID en la base de datos
            const product = await productsModel.findById(id);
            if (!product) {
                console.error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            console.error("Error al obtener producto por ID:", error);
        }
    }

    // Método para actualizar un producto existente
    async updateProduct(id, updateData) {
        try {
            // Busca y actualiza el producto por su ID en la base de datos
            const updatedProduct = await productsModel.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedProduct) {
                console.error("Producto no encontrado");
            }
            console.log("Producto actualizado correctamente:", updatedProduct);
            return updatedProduct;
        } catch (error) {
            console.error("Error al actualizar producto:", error);
        }
    }

    // Método para eliminar el producto por ID
    async deleteProduct(id) {
        try {
            // Elimina un producto por su ID de la base de datos
            const deletedProduct = await productsModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                console.error("Producto no encontrado");
            }
            console.log("Producto eliminado correctamente:", deletedProduct);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    }
}
