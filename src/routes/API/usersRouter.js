import { Router } from "express";
import userController from "../../controllers/usersController.js";

const router = Router();
const { getUsers, getUserById, addUser, updateUser, deleteUser, changeUserRole } = new userController();

// Método(petición) para obtener todos los usuarios
router.get("/", getUsers);

// Método(petición) para obtener un usuario por su ID
router.get("/:uid", getUserById);

// Método(petición) POST para crear un nuevo usuario
router.post("/", addUser);

// Método(petición) PUT para actualizar un usuario existente
router.put("/:uid", updateUser);

// Método(petición) DELETE para eliminar un usuario
router.delete("/:uid", deleteUser);

// Método(petición) PUT para cambiar el rol de un usuario
router.put("/premium/:uid", changeUserRole);

export default router;
