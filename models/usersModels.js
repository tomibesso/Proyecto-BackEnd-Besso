import { Schema, model } from "mongoose";

const userCollection = "users";

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        required: true
    }
})

export const usersModel = model(userCollection, userSchema)