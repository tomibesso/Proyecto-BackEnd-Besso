import { Router } from "express";
import userManager from "../dao/UserManagerMongo.js";

const router = Router();
const UserManager = new userManager();

// Método(petición) para obtener todos los usuarios
router.get("/", async (req, res) => {
    const { limit, numPage, sortProperty, sort } = req.query;
    try {
        const users = await UserManager.getUsers(limit, numPage, sortProperty, sort); // Usa el método del manager para obtener los usuarios
        res.send(users);
    } catch (error) {
        res.status(500).send({ status: "Error", error: error.message });
    }
});

// Método(petición) para obtener un usuario por su ID
router.get("/:uid", async (req, res) => {
    const { uid } = req.params; // Obtiene el ID del usuario por params
    // Verifica si el ID proporcionado tiene 24 caracteres
    if (uid.length !== 24) return res.status(400).send({ status: "Error", error: "El ID proporcionado no es válido" });

    try {
        const user = await UserManager.getUserById(uid); // Usa el método del manager para obtener el usuario por ID
        if (!user) return res.status(404).send({ status: "Error", error: "Usuario no encontrado" });
        res.send({ status: "Success", payload: user });
    } catch (error) {
        res.status(500).send({ status: "Error", error: error.message });
    }
});

// Método(petición) POST para crear un nuevo usuario
router.post("/", async (req, res) => {
    const { firstName, lastName, email, password } = req.body; // Obtiene los datos del nuevo usuario desde el body de la petición(req)

    if (!email) return res.status(400).send({ status: "Error", error: "Completa los campos obligatorios." });

    try {
        // Crea un nuevo usuario con los datos proporcionados usando el método del manager
        const result = await UserManager.addUser(firstName, lastName, email, password);
        res.send({ status: "Success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "Error", error: error.message });
    }
});

// Método(petición) PUT para actualizar un usuario existente
router.put("/:uid", async (req, res) => {
    const { uid } = req.params; // Obtiene el ID del usuario a actualizar por params
    const { firstName, lastName, email, password } = req.body; // Obtiene los datos actualizados desde el body de la petición(req)

    if (!uid || !firstName || !lastName || !email || !password) return res.status(400).send({ status: "Error", error: "Completa todos los campos" });

    try {
        // Usa el método del manager para actualizar el usuario
        const result = await UserManager.updateUser(uid, { firstName, lastName, email, password });
        if (!result) return res.status(404).send({ status: "Error", error: `No se encontró un usuario con el ID: ${uid}` });
        res.send({ status: "Success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "Error", error: error.message });
    }
});

// Método(petición) DELETE para eliminar un usuario
router.delete("/:uid", async (req, res) => {
    const { uid } = req.params; // Obtiene el ID del usuario a eliminar por params
    try {
        // Usa el método del manager para eliminar el usuario
        const result = await UserManager.deleteUser(uid);
        if (!result) return res.status(404).send({ status: "Error", error: "Usuario no encontrado" });
        res.send({ status: "Success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "Error", error: error.message });
    }
});

export default router; 
