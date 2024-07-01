import { CartService } from "../service/index.js";

class cartController {
    constructor() {
        this.cartService = CartService
    }

    addCart = async (req, res) => {
        try {
            const newCart = await this.cartService.addCart();
            res.status(200).send({ status: 'success', cart: newCart });
        } catch (error) {
            console.error('Error adding cart:', error);
            res.status(500).send({ status: 'error', message: 'Could not add cart' });
        }
    }
    

    getCartById = async (req, res) => {
        const cartId = req.params.cid; // Obtiene el ID del carrito de los parámetros de la solicitud
        const cart = await this.cartService.getCartById(cartId); // Utiliza el método para obtener el carrito por su ID
    
        if (!cart) { // verifica si el carrito existe
            res.status(404).send({ status: 'error', message: 'No se encontró el carrito' });
            return;
        }
    
        if (cart.products.length === 0) { // verifica si el carrito contiene productos
            console.error(`El carrito con ID ${cartId} no tiene productos`);
            res.status(404).send({ status: 'error', message: 'El carrito no tiene productos' });
            return;
        }
    
        res.status(200).send({ status: 'success', products: cart.products });
    }

    addProductToCart = async (req, res) => {
        const cartId = req.params.cid; // Pasa a numero el params pasado
        const productId = req.params.pid; // Pasa a numero el params pasado
        const addProduct = await this.cartService.addProductToCart(cartId, productId); // Utiliza el metodo de CartManager para agregar el producto al carrito
        if (addProduct) {
            res.status(200).send({ status: 'success', message: 'Producto agregado al carrito' });
        } else {
            res.status(404).send({ status: 'error', message: 'No se pudo agregar el producto al carrito' });
        }
    }

    deleteProductsFromCart = async (req, res) => {
        const cartId = req.params.cid; // Pasa a numero el params pasado
        const productId = req.params.pid; // Pasa a numero el params pasado
        const deleteProduct = await this.cartService.deleteProductsFromCart(cartId, productId);
        if(deleteProduct) {
            res.status(200).send({ status: 'success', message: 'Producto eliminado del carrito exitosamente'})
        } else {
            res.status(400).send({ status: 'error', message: 'El producto no pudo ser eliminado'});
        }
    }

    updateCart = async (req, res) => {
        const cartId = req.params.cid;
        const newProducts = req.body.products; // Suponiendo que los productos se envían en el cuerpo de la solicitud bajo la clave "products"
    
        try {
            const updatedCart = await this.cartService.updateCart(cartId, newProducts);
    
            if (updatedCart) {
                return res.status(200).json({
                    status: "success",
                    payload: updatedCart,
                    message: "Carrito actualizado exitosamente"
                });
            } else {
                return res.status(404).json({
                    status: "error",
                    message: "El carrito no se encontró"
                });
            }
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            return res.status(500).json({
                status: "error",
                message: "Ocurrió un error al procesar la solicitud"
            });
        }
    }

    updateProductQuantity = async (req, res) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity; // Envio por body el campo "quantity" con el numero actualizado
    
        try {
            const updatedCart = await this.cartService.updateProductQuantity(cartId, productId, newQuantity);
    
            return res.status(200).json({
                status: "success",
                payload: updatedCart,
                message: "Cantidad del producto actualizada exitosamente en el carrito"
            });
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito:", error);
            return res.status(500).json({
                status: "error",
                message: "Ocurrió un error al procesar la solicitud"
            });
        }
    }

    deleteAllProducts = async (req, res) => {
        const cartId = req.params.cid
    
        try {  
            const result = await this.cartService.deleteAllProducts(cartId)
        
            res.status(200).send({status: "sucess", payload: result, message: "Productos borrados del carrito"});
        } catch (error) {
            console.error("Error al eliminar los productos del carrito");
            res.status(500).send({status: "Error", message: "Error al eliminar los productos"})
        }
    }
}

export default cartController;