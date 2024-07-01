export default class ProductRepository {
    constructor(productsDao){
        this.productsDao = productsDao
    }

    getProducts    = async (limit, numPage, sort, category, stock) => await this.productsDao.getAll(limit, numPage, sort, category, stock)

    getProductById = async id => await this.productsDao.getById(id)

    addProduct     = async (title, description, price, thumbnails, code, stock, category) => await this.productsDao.create(title, description, price, thumbnails, code, stock, category)

    updateProduct  = async ( id, updateData ) => await this.productsDao.update(id, updateData)
    
    deleteProduct  = async id => await this.productsDao.delete(id)
}