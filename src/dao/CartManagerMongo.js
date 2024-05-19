import { cartsModel } from "./models/cartsModel.js";
import productManager from "./ProductManagerMongo.js";

const ProductManager = new productManager


export default class CartManager {

    // Método para agregar un nuevo carrito
    async addCart() {
        try {
            const newCart = await cartsModel.create({ products: [] }); // Crea un nuevo carrito
            console.log("Carrito agregado correctamente:", newCart);
            return newCart;
        } catch (error) {
            console.error("Error al agregar carrito:", error);
        }
    }

    // Método para agregar un producto a un carrito existente
    async addProductToCart(cartId, productId) {
        try {
            const cart = await cartsModel.findById(cartId); // Buscamos el carrito por su ID
            if (!cart) { // validación en caso de que el carrito no exista
                console.error(`Carrito ${cartId} no encontrado`);
                return false;
            }
    
            const filter = { _id: cartId }; // identificamos el carrito a actualizar
            const update = { $inc: { "products.$[elem].quantity": 1 } }; // utilizamos $inc para incrementar la cant. de la prop. quantity dentro del producto
            const options = { arrayFilters: [{ "elem.product": productId }] }; // especificamos filtros de arrays para identificar el elemento del producto a actualizar.
            
            // Verificamos si el producto ya está en el carrito
            const existingProduct = cart.products.find(item => item.product.toString() === productId);

            if (existingProduct) { // Si el producto ya está en el carrito, aumentamos su cantidad
                await cartsModel.updateOne(filter, update, options); // actualizamos el documento en la base de datos
                console.log('Producto existente aumentado en 1 unidad');
            } else {
                // Si el producto no está en el carrito, lo agregamos con cantidad 1
                cart.products.push({ product: productId, quantity: 1 });
                console.log(`Producto ${productId} agregado al carrito ${cartId}`);
            }

            await cart.save(); // guardamos los cambios nuevamente en la base de datos
            return true;
        } catch (error) {
            console.error(`Error al agregar producto al carrito ${cartId}:`, error);
            return false;
        }
    }
    
    async updateCart(cartId, newProducts) {
        try {
            // Actualiza el carrito con el nuevo arreglo de productos
            const updatedCart = await cartsModel.findByIdAndUpdate(cartId, { products: newProducts }, { new: true });
            return updatedCart;
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            throw new Error("Ocurrió un error al actualizar el carrito");
        }
    }

    // Método para obtener los productos de un carrito en específico usando su ID
    async getProductsFromCart(cartId) {
        try {
            const cart = await cartsModel.findById(cartId); // Buscamos el carrito por su ID y poblamos los productos
            if (!cart) {
                return []; // Si el carrito no existe, devolvemos un arreglo vacío
            }
            
            // Mapeamos los productos en el carrito y devolvemos un objeto con el ID del producto y su cantidad
            return cart.products.map(item => ({ id: item.product._id, quantity: item.quantity }));
        } catch (error) {
            console.error(`Error al obtener productos del carrito ${cartId}:`, error);
            return []; // En caso de error, devolvemos un arreglo vacío
        }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            // Encuentra el carrito por su ID
            const cart = await cartsModel.findById(cartId);

            // Encuentra el índice del producto en el array de productos del carrito
            const productIndex = cart.products.findIndex(product => product.product === productId);

            // Si el producto no existe en el carrito, devuelve un error
            if (productIndex === -1) {
                throw new Error("El producto no se encontró en el carrito");
            }

            // Actualiza la cantidad del producto en el carrito
            cart.products[productIndex].quantity = newQuantity;

            // Guarda los cambios en la base de datos
            await cart.save();

            return cart;
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            throw error;
        }
    }

    // Método para obtener un carrito por su ID
    async getCartById(cartId) {
        const cartById = await cartsModel.findById(cartId).populate('products.product') // obtenemos el carrito por ID
        if (cartById) {
            return cartById;
        } else {
            console.error("Carrito no encontrado");
            return false;
        }
    }
    
    async deleteProductsFromCart(cartId, productId) {
        try {
            // Realiza la eliminación del producto del carrito
            const result = await cartsModel.updateOne({ _id: cartId }, { $pull: { products: { product: productId } } });
    
            if (result.modifiedCount > 0) { // valida que al menos un documento fue modificado
                console.log("Producto eliminado con éxito.");
                return true;
            } else {
                console.log("El producto no se encontró en el carrito");
                return false;
            }
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
        }
    }

    async deleteAllProducts(cartId) {
        try {
            const cart = await cartsModel.findById(cartId);

            if (cart) {
                cart.products = [];
                await cart.save();
            } else {
                console.error("No se encontró el carrito.");
            }
        } catch (error) {
            console.error("Error al eliminar todos los productos del carrito:", error);
            throw error;            
        }
    }
    
}