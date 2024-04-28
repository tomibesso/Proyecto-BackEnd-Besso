import { Schema, model } from "mongoose"; 

const userCollection = "users"; // Defino el nombre de la colección

// Guardo en una const la plantilla o esquema de los datos del documento
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        required: true
    }
})

// Crea el modelo de usuario utilizando el esquema definido y lo exporta
export const usersModel = model(userCollection, userSchema)