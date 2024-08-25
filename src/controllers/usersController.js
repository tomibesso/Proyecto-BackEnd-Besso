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
            req.logger.error(error);
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
            res.status(200).send({ status: "Success", payload: user });
        } catch (error) {
            req.logger.error(error);
            res.status(500).send({ status: "Error", error: error.message });
        }
    }

    // Agregar nuevo usuario
    addUser = async (req, res, next) => {
        const { firstName, lastName, email, password, age } = req.body;
    
        try {
            if (!firstName || !lastName || !email || !age) {
                CustomError.createError({
                    name: 'Error al crear el usuario',
                    cause: generateUserError({firstName, lastName, age, email}),
                    message: 'Error al crear el usuario',
                    code: EError.INVALID_TYPE_ERROR
                })
            }

            const result = await this.userService.addUser(firstName, lastName, email, password, age);
            res.status(201).send({ status: "Success", payload: result });
        } catch (error) {
            req.logger.error(error);
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
            res.status(200).send({ status: "Success", payload: result });
        } catch (error) {
            req.logger.error(error);
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
            res.status(200).send({ status: "Success", payload: result });
        } catch (error) {
            req.logger.error(error);
            res.status(500).send({ status: "Error", error: error.message });
        }
    }

    // Cambiar rol de usuario
    changeUserRole = async (req, res) => {
        const { uid } = req.params;

        if (!uid || uid.length !== 24) {
            return res.status(400).send({ status: "Error", error: "ID de usuario no válido" });
        }

        try {
            const user = await this.userService.getUserById(uid);
            if (!user) {
                return res.status(404).send({ status: "Error", error: "Usuario no encontrado" });
            }

            const newRole = user.role === 'user' ? 'premium' : 'user';
            
            if(newRole === 'user') {
                const updatedUser = await this.userService.updateUser(uid, { role: newRole })
                return res.status(200).send({ status: "Success", payload: updatedUser });
            }

            if (newRole === 'premium') {
                if (user.documents.length > 0) {
                    const updatedUser = await this.userService.updateUser(uid, { role: newRole });
                    return res.status(200).send({ status: "Success", payload: updatedUser });
                } else {
                    return res.status(409).send({ status: "Error", error: "Falta documentación para cambiar rol de usuario a premium."});
                }
            }
        } catch (error) {
            req.logger.error(error);
            res.status(500).send({ status: "Error", error: error.message });
        }
    };

    // Subir documento
    uploadDocuments = async (req, res) => {
        const { uid } = req.params;
        const files = req.files;
        const { type } = req.body

        let folder

        switch (type) {
            case "product": 
                folder = 'products';
                break;
            case "profile": 
                folder = 'profiles';
                break;
            default:
                folder = 'documents';
                break;
        }

        if (!uid || uid.length !== 24) {
            return res.status(400).send({ status: "Error", error: "ID de usuario no válido" });
        }

        try {
            const user = await this.userService.getUserById(uid);
            if (!user) {
                return res.status(404).send({ status: "Error", error: "Usuario no encontrado" });
            }            

            const documents = files.map(file => ({
                name: file.originalname,
                reference: `/uploads/${folder}/${file.filename}`
            }));

            user.documents.push(...documents);
            const updatedUser = await this.userService.updateUser(uid, { documents: user.documents });

            if (user.documents.length > 0) {
                await this.userService.updateUser(uid, { status: "Documents uploaded" });
                return res.status(200).send({ status: "Success", payload: updatedUser });
             }
    
             return res.status(200).send({ status: "Success", payload: updatedUser });
        } catch (error) {
            req.logger.error(error);
            return res.status(500).send({ status: "Error", error: error.message });
        }
    }
}

export default userController;