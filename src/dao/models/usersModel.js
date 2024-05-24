import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userCollection = "users"; // Defino el nombre de la colección

// Guardo en una const la plantilla o esquema de los datos del documento
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
})

userSchema.plugin(mongoosePaginate)

// Crea el modelo de usuario utilizando el esquema definido y lo exporta
export const usersModel = model(userCollection, userSchema)