import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products"

const productSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: String,
    code: String,
    stock: Number,
    category: String
})

productSchema.plugin(mongoosePaginate)

export const productsModel = model(productCollection, productSchema)