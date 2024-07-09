export const generateUserError = (user) => {
    return `Hay una de las propiedades del usuario incompletas o no valida.
    Listado de propiedades requeridos:
    * firstName: necesita ser un string, pero se recibio ${user.firstName}
    * lastName: necesita ser un string, pero se recibio ${user.lastName}
    * email: necesita ser un string, pero se recibio ${user.email}
    * age: necesita ser un string, pero se recibio ${user.age}
    `
}