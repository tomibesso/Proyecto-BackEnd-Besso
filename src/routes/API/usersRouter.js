import { Router } from "express";
import userController from "../../controllers/usersController.js";
import { uploader } from "../../multer.js";
import { passportCall } from "../../utils/passportCall.js";
import { authorization } from "../../utils/authorizationJWT.js";

const router = Router();
const { getUsers, getUserById, getUserByMail, addUser, updateUser, deleteUser, deleteUsers, changeUserRole, uploadDocuments } = new userController();

// Método(petición) para obtener todos los usuarios
router.get("/", getUsers);

// Método(petición) para obtener un usuario por su Mail
router.get("/mail", passportCall('jwt'), authorization('admin'), getUserByMail);

// Método(petición) para obtener un usuario por su ID
router.get("/:uid", passportCall('jwt'), authorization('admin'), getUserById);

// Método(petición) POST para crear un nuevo usuario
router.post("/", addUser);

// Método(petición) PUT para actualizar un usuario existente
router.put("/:uid", passportCall('jwt'), authorization('admin'), updateUser);

// Método(petición) DELETE para eliminar un usuario
router.delete("/:uid", passportCall('jwt'), authorization('admin'), deleteUser);

// Método(petición) DELETE para eliminar usuarios inactivos (2 días)
router.delete("/", passportCall('jwt'), authorization('admin'), deleteUsers);

// Método(petición) PUT para cambiar el rol de un usuario
router.put("/premium/:uid", passportCall('jwt'), authorization('admin'), changeUserRole);

// Método(petición) POST para subir documentos de usuario
router.post("/:uid/documents", uploader.array('documents'), uploadDocuments);

export default router;
