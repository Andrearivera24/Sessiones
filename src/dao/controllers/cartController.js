//---------------------------------------------CLASE DE CARTMANAGER.----------------------------------------------------------------------------------
// trabajando con módulos.
import fs from "fs";
import ProductManager from "./productManager.js";

const productManager = new ProductManager("./products.json");

export default class CartManager {
  //--> exporto la clase.
  #id = 0; //  variable privada.
  constructor(path) {
    //--> La ruta como parámetro, para luego al instanciar la clase, pasarle la ruta real.
    this.path = path;
    // valido que no exista el archivo, y luego lo escribo creando un array vacío.
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }
  //---------------------------------addCart (crea un carrito con { id : id, products = []}) ------------------------------------------------------------------
  async addCart(arrayProducts) {
    try {
      const cartsAct = await this.getCarts(); //obtengo el archivo con los carritos actuales, llamando a getCarts()
      const id = cartsAct.length > 0 ? cartsAct[cartsAct.length - 1].id + 1 : 1; // si hay carritos, busca el id del último y le suma 1. si no le pone uno. // le asigno id autoincrementable
      const newCart = { products: arrayProducts }; // paso la lista de productos al objeto.
      newCart.id = id; //asigno el id incrementable

      cartsAct.push(newCart); // Agrego el nuevo producto a la lista anterior
      //Debido a que la lista anterior se modificó, tengo que escribirla nuevamente(actualizada y en formato stringify);
      await fs.promises.writeFile(this.path, JSON.stringify(cartsAct));
      return cartsAct;
    } catch (err) {
      console.log(`Algo salió mal al intentar agregar un carrito ERROR:${err}`);
    }
  }
  //-------------------------------- Método getCarts (retorna los carritos parseados) -----------------------------------------------------------------
  async getCarts() {
    try {
      const cartsAct = await fs.promises.readFile(this.path, "utf-8"); //leo y guardo en variable los productos
      const cartsActParseados = JSON.parse(cartsAct); // Retorno los productos parseados.
      return cartsActParseados;
    } catch (err) {
      console.log(
        `Algo salió mal al intentar obtener los carritos parseados, ERROR: ${err}`
      );
    }
  }
  //------------------------------------- getProductsByidCart (devuelve la lista de productos del carro con el id solicitado). -----------------------------------------------------------------------
  // esta función la uso en La ruta GET /:cid
  async getProductsByidCart(idCart) {
    try {
      const cartsAct = await this.getCarts(); // -->  Obtengo los carts parseados con el método que ya sabe cómo hacerlo.
      const idcartFound = await cartsAct.find((cart) => cart.id === idCart);

      const productsList = idcartFound.products; // del cart con id solicitado, devuelvo la lista de productos.
      return productsList;
    } catch (err) {
      console.log(
        `Algo salió mal al intentar obtener la lista de productos del idCart especificado, ERROR: ${err}`
      );
    }
  }

  //----------------------------------Metodo addProductToCart--------------------------------------
  //deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:

  async addProductToCart(cartId, productId) {
    //"La ruta POST  /:cid/product/:pid (req.params.cid, req.params.pid)
    try {
      let producto = await productManager.getProductById(productId); // traigo el producto que pase por parámetro.
      // traigo todos los carritos.
      const cartsAct = JSON.parse(
        await fs.promises.readFile(this.path, "utf-8")
      );
      // Obtengo el que coindice con el id que pasó por parámetro.
      let cartFound = cartsAct.filter((cart) => {
        return cart.id === cartId;
      })[0];
      //busco el índice del producto solicitado.
      let indice = cartFound.products.findIndex((producto) => {
        return producto.id === productId;
      });

      // Valido existencia del índice en el carrito.
      if (indice === -1) {
        //  si no existe, creo el producto con {id: pid, quantity: 1}
        let producto = { id: productId, quantity: 1 };
        cartFound.products.push(producto);
      } else {
        let cantidad = cartFound.products[indice].quantity + 1; //- > si existe el producto, creo la cantidad que tiene y le sumo 1
        producto = { id: productId, quantity: cantidad }; //al producto que traje por id y le asigno la cantidad y el id.
        cartFound.products[indice] = producto; // Reemplazo el producto actualizado en el indice encontrado.
      }

      await fs.promises.writeFile(this.path, JSON.stringify(cartsAct)); // reescribo el archivo JSON.
    } catch (err) {
      console.log(
        `Algo salió mal al agregar un producto al cart con id: ${cid}, ERROR: ${err}`
      );
    }
  }
}

//----------------------- CREO UNA INSTRANCIA DE LA CLASE Y HAGO LAS PRUEBAS CON UNA FUNCIÓN ASÍNCRONA -------------------------

const carts = new CartManager("./carts.json"); // le paso a ruta.

const pruebas = async () => {
  try {
    //agrego los carritos
    await carts.addCart([]);
    // obtengo la lista de producsot del carrito con id 1. debería ser {tile : "Producto 1 ", description : "Esta es la 1 prueba para ver si funciona crear productos en un carrito"}
    //console.log( await carts.getProductsByidCart(3));
    // await carts.addProductToCart(1, 1); // agregar en el carrito uno el producto 1.
    //await carts.addProductToCart(1, 1); // agregar en el carrito uno el producto 1.
  } catch (err) {
    console.log(
      `Algo salió mal al hacer las pruebas del Cart Manager, ERROR: ${err}`
    );
  }
};

//pruebas(); // ejecuto las pruebas
