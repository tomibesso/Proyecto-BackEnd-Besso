import { Schema, model } from "mongoose";
import shortid from "shortid";

const ticketCollection = "tickets"

const ticketSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: shortid.generate
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  },
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'products.product'
    },
    productTitle: String,
    productPrice: Number,
    quantity: Number
  }]
});

export const ticketsModel = model(ticketCollection, ticketSchema);
