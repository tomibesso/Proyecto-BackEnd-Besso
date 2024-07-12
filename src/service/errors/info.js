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