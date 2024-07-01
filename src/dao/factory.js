import { connectDb, objectConfig } from "../config/index.js";

export let ProductsDao
export let CartsDao
export let UsersDao

switch (objectConfig.persistence) {
    case "FS":
        const { default: ProductDaoFS } = await import('./FileSystem/ProductDAOFS.js')
        const { default: CartDaoFS } = await import('./FileSystem/CartDAOFS.js')
        const { default: UserDaoFS } = await import('./FileSystem/UserDAOFS.js')

        ProductsDao = ProductDaoFS
        CartsDao = CartDaoFS
        UsersDao = UserDaoFS
        break;

    default:
        connectDb()
        const { default: ProductDaoMongo } = await import("./Mongo/ProductDAOMongo.js")
        const { default: CartDaoMongo } = await import("./Mongo/CartDAOMongo.js")
        const { default: UsersDaoMongo } = await import("./Mongo/UserDAOMongo.js")

        ProductsDao = ProductDaoMongo
        CartsDao = CartDaoMongo
        UsersDao = UsersDaoMongo 
        break;
}