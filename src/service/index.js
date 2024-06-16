import userManager from "../dao/UserDAOMongo.js";
import productManager from "../dao/ProductDAOMongo.js";
import CartManager from "../dao/CartDAOMongo.js";

export const UserService = new userManager();
export const ProductService = new productManager();
export const CartService = new CartManager();