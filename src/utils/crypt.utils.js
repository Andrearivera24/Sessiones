import bcrypt, { hashSync } from "bcrypt";

//encripta la constraseña
export const hashPassword = (password)=>{
return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Compara la contraseña
export const comparePassword = (pass, user)=>{ 
  return bcrypt.compareSync(pass, user.password);
};