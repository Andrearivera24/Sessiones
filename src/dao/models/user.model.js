import mongoose from "mongoose";
import { cartModel } from "./cart.model.js";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true, index: true },
  age: Number,
  password: String,
  img: String,
  cart: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: cartModel,
			},
		],
		default: [],
	},
  role: {type: String, default: 'user'}
});

const userModel = mongoose.model("usersCoder2", userSchema); //nombre, modelo

export default userModel;
