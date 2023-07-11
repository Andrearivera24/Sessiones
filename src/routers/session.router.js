//viwes para los productos y el carrito 
import { Router } from "express";
import productService from "../dao/services/product.service.js";
import cartService from "../dao/services/cart.service.js";
import { isAuth, isGuest } from "../middlewares/auth.middlewares.js";


const sessionRouter = Router();
//Muestra el perfil del usuario, que usa el middleware que autentifica
sessionRouter.get("/current", isAuth,  (req, res) => {
  const { user } = req.session;
  delete user.password;
  res.render("current", { title: "Perfil de Usuario", user}); //envía el usuario que esté en el reqsession.user
});



// session PRODUCTS CON PAGINACIÓN. 
sessionRouter.get('/products', async (req, res)=>{
 const {user} = req.session; 
 const { page, limit, sort, category, status} = req.query;
 const data = await productService.getProducts(page, limit, sort, category, status);
 console.log(data);
  try {
    res.render('products', {user, data});
  } catch (err) {
    res.status(500).send({ ERROR: err });
  }
})

//Plantilla que muestra los productos de carrito en específico. 
sessionRouter.get('/carts/:cid', async (req, res)=>{ 

  try {
    const cid = req.params.cid
    const cart = await cartService.getCartPopulated(cid);
    
    res.render('carts', {title:'Carts Detail', cart});
  } catch (err) {
    res.status(500).send({ ERROR: err });
  }
});


//Muestra el perfil del usuario, que usa el middleware que autentifica
sessionRouter.get("/", isAuth,  (req, res) => {
  const { user } = req.session;
  delete user.password;
  res.render("current", { title: "Perfil de Usuario", user}); //envía el usuario que esté en el reqsession.user
});

//Registra un nuevo usuario
sessionRouter.get("/register", isGuest, (req, res) => {
  res.render("register", { title: "Registrar Nuevo Usuario" });
});

//El login valida los datos del registro
sessionRouter.get("/login", (req, res) => {
  res.render("login", { title: "Iniciar Sesión" });
});


//vistas de errores

sessionRouter.get('/registererror', (req, res)=>{
res.render('registererror', {message: 'Error al registrarse'})
})

sessionRouter.get('/loginerror', (req, res)=>{
  res.render('login', {message: 'Error al iniciar sesión'})
})





export default sessionRouter;