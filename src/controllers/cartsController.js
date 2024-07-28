import { CartService } from "../service/index.js";
import { ProductService } from "../service/index.js";
import { ticketsModel } from "../dao/models/ticketModel.js";
import { sendTicket } from "../utils/sendTicket.js";
import { CustomError } from "../service/errors/customError.js";
import { EError } from "../service/errors/enums.js";
import { generateAddProductError, generateCartError } from "../service/errors/info.js";
import { isValidObjectId } from "mongoose";

class cartController {
    constructor() {
        this.cartService = CartService
    }

    addCart = async (req, res) => {
        try {
            const newCart = await this.cartService.addCart();
            res.status(200).send({ status: 'success', cart: newCart });
        } catch (error) {
            req.logger.error('Error adding cart:', error);
            res.status(500).send({ status: 'error', message: 'Could not add cart' });
        }
    }
    

    getCartById = async (req, res, next) => {
        const cartId = req.params.cid; // Obtiene el ID del carrito de los parámetros de la solicitud
        
        try {           
            if (cartId.length !== 24) { // verifica si el carrito existe
                CustomError.createError({
                    name: 'Error al encontrar el carrito',
                    cause: generateCartError({cartId}),
                    message: 'Error al encontrar el carrito',
                    code: EError.INVALID_PARAM
                })
                return;
            }

            const cart = await this.cartService.getCartById(cartId); // Utiliza el método para obtener el carrito por su ID
            
            if (!cart) {
                CustomError.createError({
                    name: 'Error al encontrar el carrito',
                    cause: generateCartError({cartId}),
                    message: 'Error al encontrar el carrito',
                    code: EError.DATABASE_ERROR
                })
                res.status(404).send({ status: 'error', message: 'No se encontró el carrito' });
                return;
            }
            
            if (cart.products.length === 0) { // verifica si el carrito contiene productos
                req.logger.error(`El carrito con ID ${cartId} no tiene productos`);
                res.status(404).send({ status: 'error', message: 'El carrito no tiene productos' });
                return;
            }

            res.status(200).send({ status: 'success', products: cart.products });
        } catch (error) {
            next(error)
        }
    }

    addProductToCart = async (req, res, next) => {
        const cartId = req.params.cid; // Pasa a numero el params pasado
        const productId = req.params.pid; // Pasa a numero el params pasado
        const addProduct = await this.cartService.addProductToCart(cartId, productId); // Utiliza el metodo de CartManager para agregar el producto al carrito

        try {
            if(isValidObjectId(cartId) || isValidObjectId(productId)) { 
                CustomError.createError({
                    name: 'Error al añadir el producto al carrito',
                    cause: generateAddProductError({cartId, productId}),
                    message: 'Error al añadir el producto al carrito',
                    code: EError.INVALID_PARAM
                })
            }

            if (req.user.user.role === 'premium' && product.owner.toString() === req.user.user._id.toString()) {
                return res.status(403).send({ status: 'error', message: 'Los usuarios premium no pueden agregar sus propios productos al carrito' });
            }

            if (addProduct) {
                res.status(200).send({ status: 'success', message: 'Producto agregado al carrito' });
            }
        } catch (error) {
            next(error)
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
            req.logger.error("Error al actualizar el carrito:", error);
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
            req.logger.error("Error al actualizar la cantidad del producto en el carrito:", error);
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
            req.logger.error("Error al eliminar los productos del carrito", error);
            res.status(500).send({status: "Error", message: "Error al eliminar los productos"})
        }
    }

    purchaseProducts = async (req, res) => {
        const { cid } = req.params;

        try {
            const cart = await CartService.getCartById(cid);
            if (!cart) {
                return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
            }

            if (cart.products.length === 0) {
                return res.status(200).json({ status: 'info', message: 'Agrega productos al carrito para poder realizar una compra' });
            }

            let totalAmount = 0;
            const purchasedProducts = [];
            const failedProducts = [];

            for (const item of cart.products) {
                const product = await ProductService.getProductById(item.product._id.toString());

                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await ProductService.updateProduct(product._id, { stock: product.stock });
                    totalAmount += product.price * item.quantity;
                    purchasedProducts.push({ productId: product._id, productTitle: product.title, productPrice: product.price, quantity: item.quantity });;
                } else {
                    failedProducts.push(item);
                }
            }

            const ticket = await ticketsModel.create({
                amount: totalAmount,
                purchaser: req.user.user.email,
                products: purchasedProducts
            });

            if (ticket) {
                const productList = ticket.products.map(product => `<li>${product.productTitle} - ${product.quantity} x $${product.productPrice}</li>`).join('');
                const failedProductsList = failedProducts.map(item => `<li>${item.product.title} (ID: ${item.product._id}) - x${item.quantity}</li>`).join('');
            
                sendTicket({
                    subject: "Ticket de su compra",
                    html: `<div>
                        <h1>Ticket de compra</h1>
                        <ul>
                            <li>Usuario: ${ticket.purchaser}</li>
                            <li>Productos:
                                <ul>
                                    ${productList}
                                </ul>
                            </li>
                            <li>Total: $${ticket.amount}</li>
                            <li>Fecha: ${ticket.purchase_datetime}</li>
                            <li>Código: "${ticket.code}"</li>
                        </ul>
                    </div>
                    <div>
                        <h2>Los siguientes productos no disponian de stock:</h2>
                        <ul>
                            ${failedProductsList}
                        </ul>
                    </div>`,
                });
            }
            

            cart.products = failedProducts;
            await CartService.updateCart(cid, cart.products);

            res.send({ status: 'success', ticket });
        } catch (error) {
            req.logger.error(error);
            res.status(500).send({ status: 'error', message: 'Error al finalizar la compra' });
        }
    }
}

export default cartController;