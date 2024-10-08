import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userCollection = "users"; // Defino el nombre de la colección

// Guardo en una const la plantilla o esquema de los datos del documento
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    fullName: {
        type: String
    },
    age: {
        type: Number
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    documents: {
        type: [{
            name: {
                type: String,
                required: true
            },
            reference: {
                type: String,
                required: true
            }
        }],
        default: []
    },
    last_connection: {
        type: Date
    },
    status: {
        type: String,
        default: "Documents not uploaded"
    }
})

userSchema.plugin(mongoosePaginate)

// Crea el modelo de usuario utilizando el esquema definido y lo exporta
export const usersModel = model(userCollection, userSchema)