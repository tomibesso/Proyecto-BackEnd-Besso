import UserRepository from "../repositories/userRepository.js";
import ProductRepository from "../repositories/productRepository.js"
import CartRepository from "../repositories/cartRepository.js";
import { UsersDao, ProductsDao, CartsDao } from "../dao/factory.js";

export const UserService = new UserRepository(new UsersDao);
export const ProductService = new ProductRepository(new ProductsDao)
export const CartService = new CartRepository(new CartsDao);