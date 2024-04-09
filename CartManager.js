import fs from "fs";
import ProductManager from "./ProductManager.js";

const path = "./Carritos.json";

export default class CartManager {
    constructor(path) {
        this.carts = [];
        this.path;
        this.readCartFile();
        this.ProductManager = new ProductManager("./Productos.json")
    }

    readCartFile() {
        try {
            const data = fs.readFileSync(path, "utf-8");
            this.carts = JSON.parse(data);
        } catch (error) {
            console.error("Error al cargar carritos:", error);
        }
    }

    saveCartFile() {
        try {
            fs.writeFileSync(path, JSON.stringify(this.carts, null, 4), "utf-8");
        } catch (error) {
            console.error("Error al guardar carritos:", error);
        }
    }

    addCart() {
        const newCartId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
        const newCart = { id: newCartId, products: [] };
        this.carts.push(newCart);
        this.saveCartFile();
        console.log("Carrito agregado correctamente:", newCart);
        return newCart;
    }

    addProductToCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        const productExists = this.ProductManager.getProductById(productId);
        if (!productExists) {
            console.error(`Producto con id ${productId} no encontrado`);
            return false;
        }
        if (cart) {
            // Verificar si el producto ya está en el carrito
            const existingProduct = cart.products.find(item => item.product === productId);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }
            this.saveCartFile();
            console.log(`Producto ${productId} agregado al carrito ${cartId}`);
            return true;
        } else {
            console.error(`Carrito ${cartId} no encontrado`);
            return false;
        }
    }

    getProductsFromCart(cartId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (cart) {
            return cart.products.map(item => {
                const productManager = new ProductManager();
                const product = productManager.getProductById(item.product);
                return { id: item.product, quantity: item.quantity };
            });
        } else {
            return [];
        }
    }
    

    getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    getCarts() {
        return this.carts;
    }
}
