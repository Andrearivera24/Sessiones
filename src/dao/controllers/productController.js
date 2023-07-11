//------------------------------------------------------------------------------ DESAFÍO 4 ----------------------------------------------------------------------------------
import fs from "fs";
import status from "statuses";

export default class ProductManager {
  constructor(path) {
    //--> La ruta como parámetro, para luego al instanciar la clase, pasarle la ruta real.
    this.path = path;
    // escribo el archivo Síncrona, pero antes, valido que no exista.
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }
  //----------------------------------------------------- Add Product (agrega un producto con id incrementable)------------------------------------------------------------------
  async addProduct(objeto
  ) {
    const productosAct = await this.getProducts(); //obtengo el archivo con los productos actuales, llamando a getProducts()
    const id =
      productosAct.length > 0
        ? productosAct[productosAct.length - 1].id + 1
        : 1; // si hay productos, busca el id del último y le suma 1. si no le pone uno.

    try {
      const product = {
        title: objeto.title,
        description: objeto.description,
        price: objeto.price,
        thumbnail: objeto.thumbnail,
        code: objeto.code,
        stock: objeto.stock,
        category: objeto.category,
        status: objeto.status,
      };
      product.id = id; // asignarle un id autoincrementable

      if (
        //--> Valido que ningun campo sea undefined, antes de pushear el producto.
        (product.title != undefined) &
        (product.description != undefined) &
        (product.price != undefined) &
        (product.thumbnail != undefined)&
        (product.code != undefined) &
        (product.stock != undefined) &
        (product.category != undefined)
      ) {
        productosAct.push(product); // Agrego el nuevo producto a la lista anterior
        //Debido a que la lista anterior se modificó, tengo que escribirla nuevamente(actualizada y en formato stringify);
        await fs.promises.writeFile(this.path, JSON.stringify(productosAct));
        return productosAct;
      } else {
        console.log("Todos los campos son obligatorios");
      }
    } catch (err) {
      console.log(
        `Algo salió mal al intentar agregar un producto ERROR:${err}`
      );
    }
  }
  //----------------------------- Debe tener un método addProduct (retorna los productos parseados) -----------------------------------------------------------------
  async getProducts() {
    try {
      const productosAct = await fs.promises.readFile(this.path, "utf-8"); //leo y guardo en variable los productos
      const productosActParseados = JSON.parse(productosAct); // Retorno los productos parseados.
      return productosActParseados;
    } catch (err) {
      console.log(
        `Algo salió mal al intentar obtener los objetos parseados, ERROR: ${err}`
      );
    }
  }
  //------------------------------- Debe tener un método getProductById -----------------------------------------------------------------------

  async getProductById(idProduct) {
    try {
      const productosAct = await this.getProducts(); // Objeto los productos parseados con el método que ya sabe cómo hacerlo.
      const filtroID = productosAct.filter(
        (product) => product.id === idProduct
      );
      filtroID.length === 0
        ? console.log("No existe ningún producto con el ID especificado.")
        : console.log("Producto encontrado exitosamente"); //--> Operador ternario, que valida que la lista tenga algo y devuelta el array.
      return filtroID;
    } catch (err) {
      console.log(
        `Algo salió mal al intentar obtener un producto por su ID, ERROR: ${err}`
      );
    }
  }

  //--------------------------------- Debe tener un método updateProduct ------------------------------------------------------------------------------------

  //el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo.
  // NO DEBE BORRARSE SU ID

  async updateProduct(idProduct, objeto) {
    try {
      const productosAct = await this.getProducts(); // guardo mis productos actuales
      const indiceID = productosAct.findIndex(
        // busco y guardo en esa lista el producto con el id proporcionado.
        (producto) => producto.id === idProduct
      );
      if (indiceID === -1) {
        // Valido que exista el ínice con tal id.
        console.log(
          "No existe ningún producto con el ID especificado, no se puede actualizar."
        );
      } else {
        //Object.keys(objeto) = es la clave seleccionada por el ussuario
        //Object.values(objeto) = es como el NewValue que el usuario ponga.
        const [newValue] = Object.values(objeto); // desestructuro el arrary que devuelve Object.values();
        productosAct[indiceID][Object.keys(objeto)] = newValue; // dentro de los productos; al índice indicado, le hago las modificaciones.

        //Debido a que la lista anterior se modificó, tengo que escribirla nuevamente(actualizada y en formato stringify);
        await fs.promises.writeFile(this.path, JSON.stringify(productosAct));
      }
    } catch (err) {
      console.log(
        `Algo salió mal al intentar actualizar los productos, ERROR: ${err}`
      );
    }
  }

  // -------------------------------- Debe tener un método deleteProduct -----------------------------------------------------------------
  async deleteProduct(idProduct) {
    try {
      const productosAct = await this.getProducts(); // obtengo los productos actuales
      const findIndex = productosAct.findIndex(
        (product) => product.id == idProduct
      );
      productosAct.splice(findIndex, 1); // Con el método splica, el primer argumento el índice en donde comienza a eliminar, y el segundo es cuántos elimina. Con el 1, sólo elimina ese.

      //Debido a que la lista anterior se modificó, tengo que escribirla nuevamente(actualizada y en formato stringify);
      await fs.promises.writeFile(this.path, JSON.stringify(productosAct));

      return productosAct;
    } catch (err) {
      console.log(
        `Algo salió mal al intentar eliminar un producto por su ID, ERROR: ${err}`
      );
    }
  }
}

//----------------------- CREO UNA INSTRANCIA DE LA CLASE Y HAGO LAS PRUEBAS CON UNA FUNCIÓN ASÍNCRONA -------------------------

// const products = new ProductManager("products.json"); // le paso a ruta.

// const pruebas = async () => {
//   try {
//     // await products.addProduct({
//     //   title: "Producto1",
//     //   description: "Este es el primer producto",
//     //   price: "20 USD",
//     //   thumbnail: "Ruta de la imagen",
//     //   code: 123,
//     //   stock: 10,
//     //   category: "Categoría 1",
//     //   status: true,
//     // });

//     // await products.addProduct({
//     //   title: "Producto2",
//     //   description: "Este es el segundo producto",
//     //   price: "50USD",
//     //   thumbnail: "Ruta de la imagen2",
//     //   code: 124,
//     //   stock: 15,
//     //   category: "Categoría 2",
//     //   status: true,
//     // });

//     // await products.addProduct({
//     //   title: "Producto3",
//     //   description: "Este es el tercer producto",
//     //   price: "25 USD",
//     //   thumbnail: "Ruta de la imagen3",
//     //   code: 128,
//     //   stock: 35,
//     //   category: "Categoría 3",
//     //   status: true,
//     // });
//     await products.updateProduct(1,
//      {title: "CAMBIO EL TITULO"}
//     ); //--> actualizo datos.
//     //console.log(await products.getProductById(2)); //--> Obtengo el producto con id === 2.
//     // await products.deleteProduct(1);
//     //console.log(await products.getProducts()); //--> Muestro por consola los productos.
//   } catch (err) {
//     console.log(`Algo salió mal al hacer las pruebas, ERROR: ${err}`);
//   }
// };

// //pruebas(); // ejecuto las pruebas
