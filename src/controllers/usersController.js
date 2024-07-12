import { CustomError } from "../service/errors/customError.js";
import { generateUserError } from "../service/errors/info.js";
import { UserService } from "../service/index.js";
import { EError } from "../service/errors/enums.js";

class userController {
    constructor() {
        this.userService = UserService;
    }

    // Obtener todos los usuarios
    getUsers = async (req, res) => {
        const { limit, numPage, sortProperty, sort } = req.query;
        try {
            const users = await this.userService.getUsers(limit, numPage, sortProperty, sort); // Usa el método del manager para obtener los usuarios
            res.send(users);
        } catch (error) {
            res.status(500).send({ status: "Error", error: error.message });
        }
    }

    // Obtener usuario por su id
    getUserById = async (req, res) => {
        const { uid } = req.params; // Obtiene el ID del usuario por params
        // Verifica si el ID proporcionado tiene 24 caracteres
        if (uid.length !== 24) return res.status(400).send({ status: "Error", error: "El ID proporcionado no es válido" });
    
        try {
            const user = await this.userService.getUserById(uid); // Usa el método del manager para obtener el usuario por ID
            if (!user) return res.status(404).send({ status: "Error", error: "Usuario no encontrado" });
            res.send({ status: "Success", payload: user });
        } catch (error) {
            res.status(500).send({ status: "Error", error: error.message });
        }
    }

    // Agregar nuevo usuario
    addUser = async (req, res, next) => {
        const { firstName, lastName, email, password, age } = req.body; // Obtiene los datos del nuevo usuario desde el body de la petición(req)
    
        // if (!email) return res.status(400).send({ status: "Error", error: "Completa los campos obligatorios." });
        try {
            if (!firstName || !lastName || !email || !age) {
                CustomError.createError({
                    name: 'Error al crear el usuario',
                    cause: generateUserError({firstName, lastName, age, email}),
                    message: 'Error al crear el usuario',
                    code: EError.INVALID_TYPE_ERROR
                })
            }
            // Crea un nuevo usuario con los datos proporcionados usando el método del manager
            const result = await this.userService.addUser(firstName, lastName, email, password, age);
            res.send({ status: "Success", payload: result });
        } catch (error) {
           next(error)
        }
    }

    // Actualizar usuario
    updateUser = async (req, res) => {
        const { uid } = req.params; // Obtiene el ID del usuario a actualizar por params
        const { firstName, lastName, email, password } = req.body; // Obtiene los datos actualizados desde el body de la petición(req)
    
        if (!uid || !firstName || !lastName || !email || !password) return res.status(400).send({ status: "Error", error: "Completa todos los campos" });
    
        try {
            // Usa el método del manager para actualizar el usuario
            const result = await this.userService.updateUser(uid, { firstName, lastName, email, password });
            if (!result) return res.status(404).send({ status: "Error", error: `No se encontró un usuario con el ID: ${uid}` });
            res.send({ status: "Success", payload: result });
        } catch (error) {
            res.status(500).send({ status: "Error", error: error.message });
        }
    }

    // Eliminar usuario
    deleteUser = async (req, res) => {
        const { uid } = req.params; // Obtiene el ID del usuario a eliminar por params
        try {
            // Usa el método del manager para eliminar el usuario
            const result = await this.userService.deleteUser(uid);
            if (!result) return res.status(404).send({ status: "Error", error: "Usuario no encontrado" });
            res.send({ status: "Success", payload: result });
        } catch (error) {
            res.status(500).send({ status: "Error", error: error.message });
        }
    }
}

export default userController;