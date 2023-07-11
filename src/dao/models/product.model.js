import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: false,
  },
  code: {
    type: Number,
    required: true,
    unique: true,
  },
  stock:{
    type: Number,
    required: true
  },

  category:{
    type: String,
    required: true
  },

  status:{
    type: Boolean,
    default: true
  }
});
productSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model("products", productSchema); // exporto en la colección "products" a mongoAltas usando el esquema "productSchema"

