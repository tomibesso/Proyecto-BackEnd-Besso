export const generateUserError = (user) => {
    return `Hay una de las propiedades del usuario incompletas o no válidas.
    Listado de propiedades requeridos:
    * firstName: necesita ser un string, pero se recibió ${user.firstName}
    * lastName: necesita ser un string, pero se recibió ${user.lastName}
    * email: necesita ser un string, pero se recibió ${user.email}
    * age: necesita ser un string, pero se recibió ${user.age}
    `
}

export const generateProductError = (product) => {
    return `Hay una de las propiedades del producto incompletas o no válidas.
    Listado de propiedades requeridos:
    * title: necesita ser un string, pero se recibió ${product.title}
    * description: necesita ser un string, pero se recibió ${product.description}
    * price: necesita ser un number, pero se recibió ${product.price}
    * code: necesita ser un string, pero se recibió ${product.code}
    * stock: necesita ser un number, pero se recibió ${product.stock}
    * category: necesita ser un string, pero se recibió ${product.category}
    `
}

export const generateCartError = (cart) => {
    return `No se encontró el carrito con id: ${cart.cartId}`
}

export const generateAddProductError = (params) => {
    return `Hay uno de los parametros incompletos o no válidos.
    Parametros requeridos:
    * cartId: necesita ser un ID de Mongo, pero se recibió ${params.cartId}
    * productId: necesita ser un ID de Mongo, pero se recibió ${params.productId}
    `
}

export const generateGetProductError = (product) => {
    return `El parametro ingresado no es valido.
    productId: necesita ser un ID de Mongo, pero se recibió ${product.pid}
    `
}