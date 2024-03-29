// CONSIGNA: Realizar una clase de nombre "ProductManager", el cual permitirá trabajar con múltiples productos.
// Este debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en consigna anterior).

// ASPECTOS A INCLUIR:

// ■ La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe 
// recibir la ruta a trabajar desde el momento de generar su instancia.
// ■ Debe guardar objetos con el siguiente formato:
//   - id (se debe incrementar automaticamente, no enciarse desde el cuerpo)
//   - title (nombre del producto)
//   - description (descipción del producto)
//   - price (precio)
//   - thumbnail (ruta de imagen)
//   - code (código identificador)
//   - stock (número de pizas disponibles)
// ■ ]Debe tener un método addProduct, el cual debe recibir un objeto con el formato previamente especificado,
// asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo)
// ■ Debe contar con un método "getProducts" el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.
// ■ Debe contar con un método "getProductById" el cual debe recibir un id, y tras leer el archivo, 
// debe buscar el producto con el id especificado y devolverlo en formato objeto.
// ■ Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, 
// asi también como el campo a actualizar (puede ser el objeto completo, como en una DB), 
// y debe actualizar el productoque tenga ese id en el archivo. NO DEBE BORRARSE SU ID.
// ■ Debe tener un metodo deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.

// FORMATO: Archivo de Javascript listo para ejecutarse desde node.

import fs from "fs";
const path = "./Productos.json"

export default class ProductManager {
    constructor(path) {
        this.Products = [];
        this.path = path;
        this.readProductFile();
    }

    readProductFile() {
        try {
            const data = fs.readFileSync(this.path, "utf-8");
            this.Products = JSON.parse(data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    saveProductFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.Products, null, 4), "utf-8");
        } catch (error) {
            console.error("Error al guardar productos:", error);
        }
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Debes completar todos los campos.")
            return;
        }

        if (!fs.existsSync(this.path)) {
            this.Products = [];
        }
        
        const codeExists = this.Products.some(element => element.code === code);

        if (codeExists) {
            console.error("El código ya existe.");
            return;
        }
        
        const newProduct = {
            id: this.Products.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        
        this.Products.push(newProduct);
        
        this.saveProductFile();
        console.log("Producto agregado correctamente:", newProduct);
    }

    getProducts() {
        return this.Products;
    }

    getProductById(id) {
        const product = this.Products.find(product => product.id === id);
        if (!product) {
            console.error("Not found");
        } else {
            return product;
        }
    }

    updateProduct(id, updateData) {
        const productToUpdate = this.Products.find(product => product.id === id);

        if (!productToUpdate) {
            console.error("Producto no encontrado.")
        }

        for (const property in updateData) {
            if (Object.hasOwnProperty.call(updateData, property)) {

                if (productToUpdate.hasOwnProperty(property)) {
                    productToUpdate[property] = updateData[property]
                } else {
                    console.error(`El producto no tiene el campo ${propiedad}.`);
                }
            }
        }

        this.saveProductFile();
        console.log("Producto actualizado correctamente.");
    }

    deleteProduct(id) {
        const index = this.Products.findIndex(product => product.id === id);
        if (index === -1) {
            console.error("Producto no encontrado");
            return;
        }
        this.Products.splice(index, 1); // Eliminar el producto del arreglo
        this.saveProductFile();
        console.log("Producto eliminado correctamente.");
    }
    
}