import fs from "fs";
import ProductManager from "./ProductManager.js";

const path = "./JSON/Carritos.json";

export default class CartManager {
    constructor(path) {
        this.carts = [];
        this.path;
        this.readCartFile(); // Lee el archivo de carritos al instanciar la clase
        this.ProductManager = new ProductManager("./Productos.json")
    }

    // Método para leer y cargar el archivo de carritos
    readCartFile() {
        try {
            const data = fs.readFileSync(path, "utf-8"); // Lee el archivo de carritos (Carritos.json)
            this.carts = JSON.parse(data); // Parsea los datos del archivo de carritos
        } catch (error) {
            console.error("Error al cargar carritos:", error);
        }
    }

    // Método para cargar los datos de los carritos en el archivo "Carritos.json"
    saveCartFile() {
        try {
            fs.writeFileSync(path, JSON.stringify(this.carts, null, 4), "utf-8");
        } catch (error) {
            console.error("Error al guardar carritos:", error);
        }
    }

    // Método para agregar un nuevo carrito
    addCart() {
        const newCartId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1; // Genera nuevo ID (autogenerado) para el carrito
        const newCart = { id: newCartId, products: [] }; // Crea un nuevo carrito
        this.carts.push(newCart); // Agrega el nuevo carrito al arrelgo "newCart"
        this.saveCartFile(); // Guarda los cambios en el archivo de carritos
        console.log("Carrito agregado correctamente:", newCart);
        return newCart;
    }

    // Método para agregar un producto a un carrito existente
    addProductToCart(cartId, productId) { // recibe por parámetro el id del carritos y el id del producto a agregar
        const cart = this.getCartById(cartId); // Obtiene el ID del carrito
        const productExists = this.ProductManager.getProductById(productId); // Verifica si el producto existe
        if (!productExists) { // Validación en caso de que el producto no exista
            console.error(`Producto con id ${productId} no encontrado`);
            return false;
        }
        if (cart) { // Validación en caso de que el producto sí exista
            const existingProduct = cart.products.find(item => item.product === productId); // Verificar si el producto ya está en el carrito
            if (existingProduct) { // Aumenta la cantidad (quantity) en caso de que el producto se encuentre en el carrito
                existingProduct.quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 }); // Agrega el producto al carrito con cantidad 1
            }
            this.saveCartFile(); // Guarda los cambios en el archivo de carritos
            console.log(`Producto ${productId} agregado al carrito ${cartId}`);
            return true;
        } else {
            console.error(`Carrito ${cartId} no encontrado`);
            return false;
        }
    }
    
    // Método para obtener los productos de un carrito en específico usando su ID
    getProductsFromCart(cartId) {
        const cart = this.carts.find(cart => cart.id === cartId); // Método find para obtener carrito cuya propiedad ID coincida con el ID pasado por parámetro
        if (cart) {
            return cart.products.map(item => { // Mapea los productos del carrito deseado
                const productManager = new ProductManager(); // Instancia el ProductManager para usar su método getProductById
                const product = productManager.getProductById(item.product); // Obtiene el producto por su ID
                return { id: item.product, quantity: item.quantity }; // Devuelve un objeto con la información del producto
            });
        } else {
            return []; // Devuelve un arreglo vacío si el carrito no existe
        }
    }
    
    // Método para obtener un carrito por su ID
    getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    // Método para obtener todos los carritos
    getCarts() {
        return this.carts;
    }
}