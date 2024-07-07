export default class CartRepository {
    constructor(cartsDao) {
        this.cartsDao = cartsDao
    }

    addCart = async () => await this.cartsDao.create()

    getCartById = async (cartId) => await this.cartsDao.getById(cartId)

    addProductToCart = async (cartId, productId) => await this.cartsDao.addProductToCart(cartId, productId)

    deleteProductsFromCart = async (cartId, productId) => await this.cartsDao.deleteProductsFromCart(cartId, productId)

    updateCart = async (cartId, newProducts) => await this.cartsDao.update(cartId, newProducts)

    updateProductQuantity = async (cartId, productId, newQuantity) => await this.cartsDao.updateProductQuantity(cartId, productId, newQuantity)
    
    deleteAllProducts = async (cartId) => await this.cartsDao.deleteAllProducts(cartId)

    purchaseProducts = async (cartId) => await this.cartsDao.purchaseProducts(cartId)
}