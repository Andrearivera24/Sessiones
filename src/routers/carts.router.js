import { Router } from "express";
import cartService from "../dao/services/cart.service.js";
const cartRouter = Router();

// C: Creatate cart
cartRouter.post('/', async (req, res)=>{
const cartAdded = await cartService.addCart();
try {
    res.status(201).send(cartAdded);
    
} catch (err) {
    res.status(500).send({ERROR: err});
}
});


// Agregar producto (pid) en cart (cid)
cartRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
      const product = await cartService.addProdInCart(
        req.params.cid,
        req.params.pid
      );
      res.status(201).send({ "Agregado-Resultado": { product } });
    } catch (error) {
      res.status(400).send(`${error}`);
    }
  });

//R: read, obtiene el contenido de los productos de un carrito en particular. 
cartRouter.get('/:cid',async (req, res)=>{
const cid = req.params.cid;
const cartContent = await cartService.getCartContents(cid);
try {
    res.send(cartContent);
} catch (err) {
    res.status(404).send({ERROR: err});
}

})


// D: Delete
cartRouter.delete('/:cid', async (req, res)=>{
    const cid = req.params.cid;
    const carts = await cartService.deleteCart(cid);
        try {
            res.status(204).send(carts);
            
        } catch (err) {
            res.status(404).send({ERROR: err});
        }
        });
//----EndPoints de segunda pre-entrega 

//DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
cartRouter.delete('/:cid/products/:pid', async (req, res)=>{
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cartDeleted = await cartService.delProdInCart(pid, cid); 
    try {
        res.status(204).send(cartDeleted);
    } catch (err) {
        res.status(404).send({ERROR: err});
    }

})
//PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
cartRouter.put('/:cid', async (req, res)=>{
const cid = req.params.cid; 
const product = req.body.product; // todo el producto por el body
const updatedCart = await cartService.updateCart(cid, product);
try {
    res.status(201).send(updatedCart);
} catch (err) {
    res.status(500).send({ERROR: err});
}
});

//PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
cartRouter.put('/:cid/products/:pid', async(req, res)=>{
const cid = req.params.cid;
const pid = req.params.pid;
const quantity = parseInt(req.body.quantity);
const updatedCart = await cartService.updateProdInCart(pid, cid, quantity);
try {
    res.status(201).send(updatedCart);
    
} catch (err) {
    res.status(500).send({ERROR: err});
}
});

//DELETE api/carts/:cid deberá eliminar todos los productos del carrito 
cartRouter.delete('/:cid', async (req, res)=>{
    const cid = req.params.cid
    await cartService.delAllProdsInCart(cid);
try {
    res.status(204).send();

} catch (err) {
    res.status(504).send({ERROR: err});
}

})



export default cartRouter;