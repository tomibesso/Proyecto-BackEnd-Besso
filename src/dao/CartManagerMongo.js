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
    
    

    // Método para obtener los productos de un carrito en específico usando su ID
    async getProductsFromCart(cartId) {
        try {
            const cart = await cartsModel.findById(cartId).populate('products.product'); // Buscamos el carrito por su ID y poblamos los productos
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

    // Método para obtener un carrito por su ID
    async getCartById(cartId) {
        const cartById = await cartsModel.findById({_id: cartId}); // obtenemos el carrito por ID
        if (cartById) {
            return cartById;
        } else {
            console.error("Carrito no encontrado");
            return false;
        }
    }    
}