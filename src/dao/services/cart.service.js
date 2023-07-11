import { cartModel } from "../models/cart.model.js";
import productService from "./product.service.js";
import { productModel } from "../models/product.model.js";

class CartService {
  constructor() {
    this.model = cartModel;
  }
  //----- CRUD -----
  // C: Create
  async addCart() {
    try {
      const newCart = new this.model({ products: [] });
      const createdCart = await newCart.save();
      return createdCart;
    } catch (error) {
      throw new Error(`No se pudo crear el carrito: ${error}`);
    }
  }


  async addProdInCart(cid, pid) {
    try {
      const cart = await this.model.findById(cid);
      if (!cart) {
        throw new Error("No existe el carrito buscado");
      }

      const product = await productModel.findById(pid);

      if (!product) {
        throw new Error("No existe el producto buscado");
      }

      const index = cart.products.findIndex((producto) => {
        return producto.product.toString() === pid;
      });
      if (index === -1) {
        cart.products.push({ product: pid, quantity: 1 });
      } else {
        cart.products[index].quantity += 1;
      }
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`No se pudo agregar producto al carrito: ${error}`);
    }
  }

  // R: Read
  async getCarts() {
    return await this.model.find();
  }
  // R: obtener el contenido de un carrito en particular.
  async getCartPopulated(cid){
    try {
      const cart = await this.model.findById(cid).populate('products.product').lean();
      console.log(JSON.stringify(cart));

      if (!cart) {
        throw new Error("No existe ese cart");
      }
      return cart;
    } catch (err) {
      throw new Error(`No se logró obtener el contenido del carrito: ${err}`);
    }
  }
  // D: Delete
  async deleteCart(cid) {
    return await this.model.deleteOne({ _id: cid });
  }
  // D: Elimina el producto del carrito indicado.
  async delProdInCart(pid, cid) {
    const cart = await this.model.findOne({ _id: cid }); //obtengo el cart indicad
    const prod = await productService.getProductById(pid);
    cart.products.pull(prod);
    return await cart.save(); // guardo el carrito actualizado.. 
  }

  //D: Elimina todos los productos del cart.
  async delAllProdsInCart(cid) {
    const cart = await this.model.findOne({ _id: cid });
    cart.products = [];
    return await cart.save();
  }

  //U: Update cart con todo el producto.
  async updateCart(cid, product) {
    return await this.model.updateOne({ _id: cid }, product);
  }

  //U: Update, actualiza la cantidad del producto en el cart.
  async updateProdInCart(pid, cid, quantity) {
    const cart = await this.model.findById(cid); //obtengo el cart
    const index = cart.products.findIndex(
      (producto) => producto.product.toString() === pid
    ); //obtengo el índice del producto que coíncide con el pid
    cart.products[index].quantity = quantity; // reasigno la cantidad.
    return await cart.save();
  }
}

const cartService = new CartService();
export default cartService;
 