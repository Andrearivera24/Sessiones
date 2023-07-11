import { productModel } from "../models/product.model.js";

class ProductService {
  constructor() {
    this.model = productModel;
  }

  //---------- CRUD----------
  // C: create
  async addProduct(product) {
    return await this.model.create(product);
  }

  // R: read
  async getProducts(
    page = 1,
    limit = 10,
    sort,
    category = ['beginner', 'intermediate' ,'advanced'], //todos por defecto
    status =[true, false] //todas por defecto
  )
  
  {
    try {
      return await this.model.paginate(
        {category, status},
        { page, limit, sort:{price: sort}, lean: true }
      );
    } catch (err) {
      throw new Error({ err });
    }
  }
  
  // U: update
  async updateProduct(pid, product) {
    return await this.model.updateOne({ _id: pid }, product);
  }
  // D: delete
  async deleteProduct(pid) {
    return await this.model.deleteOne({ _id: pid });
  }
  //--------------------------------
  async getProductById(pid) {
    return await this.model.findOne({ _id: pid });
  }
}

const productService = new ProductService();
export default productService;
