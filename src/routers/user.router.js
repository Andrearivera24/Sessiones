import { Router } from "express";
import passport from "passport";

const userRouter = Router();

userRouter.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/registererror" }),
  async (req, res) => {
    res.redirect("/login");
  }
);

//Login con autenticación
userRouter.post(
  "/auth",
  passport.authenticate("login", { failureRedirect: "/loginerror" }),
  async (req, res) => {
    const { email, password } = req.body;

    //verifico si existe el usuario, si no existe retorno un error
    if (!req.user) {
      return res.status(404).send("No user found");
    }
    // si existe, lo guardo y lo piso en el req.session.user, luego de borrar su contraseña
    const user = req.user;
    delete user.password;
    req.session.user = user;

    //configuro las sesiones de roles
    if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
      req.session.user = {
        first_name: "Coder",
        last_name: "Manager"}
        user.admin=true;
    }

    res.redirect("/products"); // si todo sale bien, lo redirijo a la pagina de products.
  }
);


//EndPoint de GitHub usando la estrategia

userRouter.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
	async (req, res) => {}
);
userRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), async(req, res)=>{
  req.session.user = req.user;  // guardo en la sesión el obtenido con el scope
  res.redirect('/products');
})

userRouter.post("/logout", (req, res) => {
  req.session.destroy();
  // res.status(201).json({message: "Logged out"});
  res.redirect("/login"); // redirige a la vista login
});

export default userRouter;
