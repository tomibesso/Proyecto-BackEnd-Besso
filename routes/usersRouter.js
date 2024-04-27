import { Router } from "express";
import { usersModel } from "../models/usersModels.js";

const router = Router();

// endpoint para traer los usuarios 
router.get("/", async (req, res) => {
    const users = await usersModel.find({})
    res.send(users)
})

// endpoint para traer usuario por id
router.get("/:uid", async (req, res) => {
    const { uid } = req.params;
    if(uid.length !== 24) return res.send({status: "Error", error: "El ID proporcionado no es válido"});
    const user = await usersModel.findOne({_id: uid})

    if(!user) return res.send({status: "Error", error: "Usuario no encontrado"})
    res.send({status: "Success", payload: user});
});


// endpoint para crear un usuario
router.post("/", async (req, res) => {
     const { firstName, lastName, email } = req.body;

    if(!email) return res.send({status: "Error", error: "Completa los campos obligatorios."})

     const newUser = {
        firstName,
        lastName,
        email
     }

     const result = await usersModel.create(newUser);

     res.send({status: "Success", payload: {result}})
})

// endpoint para actualizar usuario
router.put("/:uid", async (req, res) => {
    const { uid } = req.params
    const { firstName, lastName, email } = req.body
    const users = await usersModel.find({});
    const idExists = users.some(user => user._id.toString() === uid);
    
    if (!idExists) return res.send({status: "Error", error: `No se encontró un usuario con el ID: ${uid}`});
    if(!uid || !firstName || !lastName || !email) return res.send({status: "Error", error: "Completa todos los campos"})
    const result = await usersModel.updateOne({_id: uid}, {firstName, lastName, email});

    res.send({status: "Success", payload: result})
})

// endpoint para eliminar usuario
router.delete("/:uid", async (req, res) => {
    const { uid } = req.params
    const userDeleted = await usersModel.deleteOne({_id: uid})

    res.send({status: "Success", payload: userDeleted})
})

export default router