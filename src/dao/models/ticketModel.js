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
    required: true,
    unique: true
  }
});

export const ticketsModel = model(ticketCollection, ticketSchema);
