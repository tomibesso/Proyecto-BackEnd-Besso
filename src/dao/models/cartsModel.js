import { Schema, model } from "mongoose"; 

const cartCollection = "carts";

const cartSchema = new Schema({
    products: []
})

export const cartsModel = model(cartCollection, cartSchema)