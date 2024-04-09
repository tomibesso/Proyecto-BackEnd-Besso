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
            const data = fs.readFileSync(path, "utf-8");
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

    addProduct(title, description, price, thumbnails, code, stock, category) {
        if (!title || !description || !price || !category || !code || !stock) {
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
            thumbnails,
            code,
            stock,
            status: true,
            category,
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