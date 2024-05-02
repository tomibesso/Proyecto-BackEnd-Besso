import { Router } from "express";
import { usersModel } from "../dao/models/usersModel.js";

const router = Router();

// Método(petición) para obtener todos los usuarios
router.get("/", async (req, res) => {
    const users = await usersModel.find({}); // Busca todos los usuarios en la base de datos
    res.send(users);
});

// Método(petición) para obtener un usuario por su ID
router.get("/:uid", async (req, res) => {
    const { uid } = req.params; // Obtiene el ID del usuario por params
    // Verifica si el ID proporcionado tiene 24 caracteres
    if (uid.length !== 24) return res.send({ status: "Error", error: "El ID proporcionado no es válido" });

    const user = await usersModel.findOne({ _id: uid }); // Busca un usuario por su ID en la base de datos

    if (!user) return res.send({ status: "Error", error: "Usuario no encontrado" });
    res.send({ status: "Success", payload: user });
});

// Método(petición) POST para crear un nuevo usuario
router.post("/", async (req, res) => {
    const { firstName, lastName, email } = req.body; // Obtiene los datos del nuevo usuario desde el body de la petición(req)

    if (!email) return res.send({ status: "Error", error: "Completa los campos obligatorios." });

    // Crea un nuevo usuario con los datos proporcionados y lo guarda en la base de datos
    const newUser = {
        firstName,
        lastName,
        email
    };
    const result = await usersModel.create(newUser);

    res.send({ status: "Success", payload: { result } });
});

// Método(petición) PUT para actualizar un usuario existente
router.put("/:uid", async (req, res) => {
    const { uid } = req.params; // Obtiene el ID del usuario a actualizar por params
    const { firstName, lastName, email } = req.body; // Obtiene los datos actualizados desde el body de la petición(req)
    const users = await usersModel.find({}); // Busca todos los usuarios en la base de datos
    const idExists = users.some(user => user._id.toString() === uid); // Verifica si el ID proporcionado existe en la base de datos

    if (!idExists) return res.send({ status: "Error", error: `No se encontró un usuario con el ID: ${uid}` });
    if (!uid || !firstName || !lastName || !email) return res.send({ status: "Error", error: "Completa todos los campos" });

    // Actualiza el usuario en la base de datos
    const result = await usersModel.updateOne({ _id: uid }, { firstName, lastName, email });
    res.send({ status: "Success", payload: result });
});

// Método(petición) DELETE para eliminar un usuario
router.delete("/:uid", async (req, res) => {
    const { uid } = req.params; // Obtiene el ID del usuario a eliminar por params
    const userDeleted = await usersModel.deleteOne({ _id: uid }); // Elimina el usuario de la base de datos

    res.send({ status: "Success", payload: userDeleted });
});

export default router; 
