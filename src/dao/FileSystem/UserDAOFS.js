import fs from 'fs';
import { devLogger, prodLogger } from '../../utils/loggers.js';

const logger = process.env.LOGGER === 'production' ? prodLogger : devLogger
const path = "./src/JSON/Usuarios.json";

export default class UserManager {
    constructor(path) {
        this.users = [];
        this.path = path;
        this.readFile(); // Lee el archivo de usuarios al instanciar la clase
    }

    // Método para leer y cargar el archivo de usuarios
    readFile() {
        try {
            const data = fs.readFileSync(this.path, "utf-8"); // Lee el archivo de usuarios
            this.users = JSON.parse(data); // Parsea los datos del archivo de usuarios
        } catch (error) {
            logger.error("Error al cargar usuarios:", error);
        }
    }

    // Método para cargar los datos de los usuarios en el archivo "Usuarios.json"
    saveFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.users, null, 4), "utf-8");
        } catch (error) {
            logger.error("Error al guardar usuarios:", error);
        }
    }

    // Método para agregar un nuevo usuario
    create(userData) {
        try {
            const newUserId = this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1; // Genera nuevo ID (autogenerado) para el usuario
            const newUser = { id: newUserId, ...userData }; // Crea un nuevo usuario con el ID generado
            this.users.push(newUser); // Agrega el nuevo usuario al arreglo de usuarios
            this.saveFile(); // Guarda los cambios en el archivo de usuarios
            logger.info("Usuario agregado correctamente:", newUser);
            return newUser;
        } catch (error) {
            logger.error("Error al agregar usuario:", error);
            throw error;
        }
    }

    // Método para obtener todos los usuarios
    getAll(limit = 10, numPage = 1, sortProperty = "lastName", sort) {
        try {
            let sortedUsers = [...this.users];
            if (sort && (sort === "asc" || sort === "desc")) {
                sortedUsers.sort((a, b) => {
                    if (a[sortProperty] < b[sortProperty]) return sort === "asc" ? -1 : 1;
                    if (a[sortProperty] > b[sortProperty]) return sort === "asc" ? 1 : -1;
                    return 0;
                });
            }
            const totalDocs = sortedUsers.length;
            const totalPages = Math.ceil(totalDocs / limit);
            const startIndex = (numPage - 1) * limit;
            const endIndex = startIndex + limit;
            const docs = sortedUsers.slice(startIndex, endIndex);

            const baseUrl = '/users';

            const prevLink = numPage > 1 ? `${baseUrl}?numPage=${numPage - 1}` : null;
            const nextLink = numPage < totalPages ? `${baseUrl}?numPage=${numPage + 1}` : null;

            return {
                status: "success",
                payload: docs,
                totalPages: totalPages,
                prevPage: numPage > 1 ? numPage - 1 : null,
                nextPage: numPage < totalPages ? numPage + 1 : null,
                page: numPage,
                hasPrevPage: numPage > 1,
                hasNextPage: numPage < totalPages,
                prevLink: prevLink,
                nextLink: nextLink
            };
        } catch (error) {
            logger.error("Error al obtener usuarios:", error);
            return [];
        }
    }

    // Método para obtener un usuario por ID
    getById(id) {
        try {
            const user = this.users.find(user => user.id === id);
            if (!user) {
                logger.error("Usuario no encontrado", user);
                return null;
            }
            return user;
        } catch (error) {
            logger.error("Error al obtener usuario por ID:", error);
        }
    }

    // Método para obtener un usuario por filtro
    getBy(filter) {
        try {
            const user = this.users.find(user => {
                return Object.keys(filter).every(key => user[key] === filter[key]);
            });
            if (!user) {
                logger.error("Usuario no encontrado", user);
                return null;
            }
            return user;
        } catch (error) {
            logger.error("Error al obtener usuario por filtro:", error);
            throw error;
        }
    }

    // Método para actualizar un usuario existente
    update(id, updateData) {
        try {
            const userIndex = this.users.findIndex(user => user.id === id);
            if (userIndex === -1) {
                logger.error("Usuario no encontrado", userIndex);
                return null;
            }
            const updatedUser = { ...this.users[userIndex], ...updateData };
            this.users[userIndex] = updatedUser;
            this.saveFile();
            logger.info("Usuario actualizado correctamente:", updatedUser);
            return updatedUser;
        } catch (error) {
            logger.error("Error al actualizar usuario:", error);
        }
    }

    // Método para eliminar el usuario por ID
    delete(id) {
        try {
            const userIndex = this.users.findIndex(user => user.id === id);
            if (userIndex === -1) {
                logger.error("Usuario no encontrado", userIndex);
                return false;
            }
            const deletedUser = this.users.splice(userIndex, 1);
            this.saveFile();
            logger.info("Usuario eliminado correctamente:", deletedUser[0]);
            return deletedUser[0];
        } catch (error) {
            logger.error("Error al eliminar usuario:", error);
        }
    }
}
