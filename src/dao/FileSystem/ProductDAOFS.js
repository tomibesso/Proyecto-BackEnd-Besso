import fs from "fs";
import { devLogger, prodLogger } from "../../utils/loggers.js";

const logger = process.env.LOGGER === 'production' ? prodLogger : devLogger
const path = "./src/JSON/Productos.json"

export default class ProductManager {
    constructor(path) {
        this.Products = []; // Inicializa el array de la lista de productos
        this.path = path;
        this.readFile(); // Lee el archivo de productos al instanciar la clase
    }

    // Método para leer el archivo "Productos.json"
    readFile() {
        try {
            const data = fs.readFileSync(path, "utf-8");  // Lee el archivo "Productos.json"
            this.Products = JSON.parse(data); // Parsea los datos del archivo de productos
        } catch (error) {
            logger.error("Error al cargar productos:", error);
        }
    }

    // Método para guardar los productos en el archivo
    saveFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.Products, null, 4), "utf-8"); // Guarda los productos en el archivo
        } catch (error) {
            logger.error("Error al guardar productos:", error);
        }
    }

    // Método para agregar un nuevo producto 
    create(title, description, price, thumbnails, code, stock, category) { // Recibe por parametros las propiedades/campos del producto
        if (!title || !description || !price || !category || !code || !stock) { // Validación que no haya campos vacios
            logger.error("Debes completar todos los campos.")
            return;
        }

        if (!fs.existsSync(this.path)) {
            this.Products = []; // Crea un array vacío en caso de no existir ningún producto
        }
        
        const codeExists = this.Products.some(element => element.code === code); // Verifica si el "code" pasado ya existe

        if (codeExists) {
            logger.error("El código ya existe.", codeExists);
            return;
        }
        
        // Guarda en la const el objeto con el nuevo producto
        const newProduct = {
            id: this.Products.length + 1, // ID único autogenerado 
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            status: true,
            category,
        };
        
        // Agrega el producto al array "products"
        this.Products.push(newProduct);
        
        // Guarda el producto en el archivo
        this.saveFile();
        logger.info("Producto agregado correctamente:", newProduct);
    }

    // Método para obtener el array de productos
    getAll() {
        return this.Products;
    }

    // Método para obtener un producto por ID
    getById(id) {
        const product = this.Products.find(product => product.id === id); // Método find para obtener producto cuya propiedad ID coincida con el ID pasado por parámetro
        if (!product) {
            logger.error("Producto no encontrado", product);
        } else {
            return product;
        }
    }

    // Método para actualizar un producto existente
    update(id, updateData) { // Recibe por parámetro
        const productToUpdate = this.Products.find(product => product.id === id); // Busca por ID el producto a actualizar

        if (!productToUpdate) {
            logger.error("Producto no encontrado.", productToUpdate)
        }

        // Bucle for...in que reemplaza los campos a actualizar con los datos nuevos
        for (const property in updateData) {
            if (Object.hasOwnProperty.call(updateData, property)) {

                if (productToUpdate.hasOwnProperty(property)) { // Verifica si "ProductToUpdate" tiene la propiedad que se esta intentando actualizar
                    productToUpdate[property] = updateData[property] // Reemplaza los valores viejos con los nuevos
                } else {
                    logger.error(`El producto no tiene el campo ${propiedad}.`, productToUpdate);
                }
            }
        }

        // Guarda los cambios en el archivo de productos
        this.saveFile();
        logger.info("Producto actualizado correctamente.");
    }

    // Método para eliminar el producto por ID
    delete(id) {
        const index = this.Products.findIndex(product => product.id === id); // Busca el producto a eliminar
        if (index === -1) {
            logger.error("Producto no encontrado", index);
            return;
        }
        this.Products.splice(index, 1); // Eliminar el producto del arreglo
        this.saveFile(); // Guarda el archivo de nuevo pero sin el producto eliminado
        logger.info("Producto eliminado correctamente.");
    }
    
}