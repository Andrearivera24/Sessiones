//PARA QUE NO ROMPA VALIDO QUE EL USUARIO DE LA SESION EXISTA, SE SER ASÍ, CONTINUA Y SI NO, LO REDIRIGE AL LOGIN

export function isAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}
  
  //Middle ware opuesto
  
  export function isGuest(req, res, next){ //si es un invitado, pues que le mande
  if(!req.session.user){
      next();
  } else{
      res.redirect("/"); //lo redirijo a la pagina de bienvenida 
  }
  }
  