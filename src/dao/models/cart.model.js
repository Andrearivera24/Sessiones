import mongoose from "mongoose";
import { productModel } from "./product.model.js";

const cartSchema = new mongoose.Schema({
  products: [
    {
      // los productos son un de tipo lista que contendrá varios objetos de tipo id, de la coleción "products"
      product: { type: mongoose.Schema.Types.ObjectId, ref: productModel },
      quantity: { type: Number },
     
    },
  ],
});

export const cartModel = mongoose.model("carts", cartSchema); // exporto en la colección "carts" de mongoAltas usando el esquema "cartSchema"




