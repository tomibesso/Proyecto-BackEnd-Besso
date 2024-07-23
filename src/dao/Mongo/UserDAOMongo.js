import { usersModel } from "../models/usersModel.js";
import { devLogger, prodLogger } from "../../utils/loggers.js";

const logger = process.env.LOGGER === 'production' ? prodLogger : devLogger

export default class userManager {
    // Método para agregar un nuevo usuario 
    async create(userData) {
        try {
            // Guarda el nuevo usuario en la base de datos
            const newUser = await usersModel.create(userData);
            logger.info("Usuario agregado correctamente:", newUser);
            return newUser;
        } catch (error) {
            logger.error("Error al agregar usuario:", error);
            throw error;
        }
    }

    // Método para obtener todos los usuarios
    async getAll(limit = 10, numPage = 1, sortProperty = "lastName", sort) {
        try {
            let sortOption = {}; // Objeto para el ordenamiento
    
            // Si se proporciona el parámetro sort y es "asc" o "desc", se configura el objeto de ordenamiento
            if (sort && (sort === "asc" || sort === "desc")) {
                sortOption = { [sortProperty]: sort };
            }
    
            // Obtiene todos los usuarios de la base de datos
            const { docs, page, totalDocs, hasPrevPage, hasNextPage } = await usersModel.paginate({}, {
                limit: limit,
                page: numPage,
                sort: sortOption, // Se aplica el ordenamiento según corresponda
                lean: true
            });

            const totalPages = Math.ceil(totalDocs / parseInt(limit));

            const baseUrl = '/users';

            const prevLink = hasPrevPage ? `${baseUrl}?numPage=${page - 1}` : null;
            const nextLink = hasNextPage ? `${baseUrl}?numPage=${page + 1}` : null;

            return {
                status: "success",
                payload: docs,
                totalPages: totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink
            };

        } catch (error) {
            logger.error("Error al obtener usuarios:", error);
            return [];
        }
    }    

    // Método para obtener un usuario por ID
    async getById(id) {
        try {
            // Busca un usuario por su ID en la base de datos
            const user = await usersModel.findById(id).lean();
            if (!user) {
                logger.error("Usuario no encontrado", user);
            }
            return user;
        } catch (error) {
            logger.error("Error al obtener usuario por ID:", error);
        }
    }

    // Método para obtener un usuario por filtro
    async getBy(filter) {
        try {
            // Busca un usuario en la base de datos de acuerdo al filtro
            const user = await usersModel.findOne(filter).lean();
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
    async update(id, updateData) {
        try {
            // Busca y actualiza el usuario por su ID en la base de datos
            const updatedUser = await usersModel.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedUser) {
                logger.error("Usuario no encontrado", updatedUser);
            }
            logger.info("Usuario actualizado correctamente:", updatedUser);
            return updatedUser;
        } catch (error) {
            logger.error("Error al actualizar usuario:", error);
        }
    }

    // Método para eliminar el usuario por ID
    async delete(id) {
        try {
            // Elimina un usuario por su ID de la base de datos
            const deletedUser = await usersModel.findByIdAndDelete(id);
            if (!deletedUser) {
                logger.error("Usuario no encontrado", deletedUser);
                return false
            }
            logger.info("Usuario eliminado correctamente:", deletedUser);
            return deletedUser;
        } catch (error) {
            logger.error("Error al eliminar usuario:", error);
        }
    }
}
