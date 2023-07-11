import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { hashPassword, comparePassword } from "../utils/crypt.utils.js";
import userService from "../dao/services/user.service.js";

const localStrategy = local.Strategy;

const initializePassword = () => {
  //Passport user recibe el nombre y la estrategia, la estraegia recibe las condiciones y la función asincrónica.
  // Estrategia para el register
  passport.use(
    "register",
    new localStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, username, password, done) => {
        const { first_name, last_name, img } = req.body; //obtengo del formulario los campos que pasaré como nuevo usuario
        try {
          //Recupero el usuario por email, ahora username
          const user = await userService.getByEmail(username);
          //si ya existe, lanzo error.
          if (user) {
            return done(null, false, { message: "User already exist" });
          }
          // si no existe, hasheo la contraseña y creo el nuevo usuario, retorno con el done.
          const hashedPassword = hashPassword(password);
          const newUser = await userService.createUser({
            first_name,
            last_name,
            email: username,
            password: hashedPassword,
            img,
          });
          return done(null, newUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  //Estrategia para el login
  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userService.getByEmail(username);
          if (!user) {
            return done(null, false, { message: "User name doesn´t exists" });
          }
          const isValidPassword = comparePassword(password, user); //devuelve un booleano
          if (!isValidPassword) {
            return done(null, false, { message: "Invalid data" });
          }
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  //Estrategia de github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.857570f4e9d88793",
        clientSecret: "c1a931d0344664b7a0621365e83aecdd2f147c94",
        callbackURL: "http://localhost:8080/api/users/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
				try {
					console.log(profile);
					let user = await userService.getByEmail(
						profile._json.email
					);

          //valido que exista y retorno el usuario autenticado ya sea si existe o no.
					if (!user) {
						let newUser = {
							first_name: profile._json.name,
							last_name: '',
							email: profile._json.email,
							password: '',
							img: profile._json.avatar_url,
						};
						user = await userService.createUser(newUser);
						done(null, user);
					} else {
						done(null, user);
					}
				} catch (error) {
					done(error, false);
				}
      }
    )
  );

  // Serialización(guarda la mínima expresion del usuario) y deserialización (con esa mínima expresión, guarda todo el usuario)

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userService.getById(id);
    done(null, user);
  });
};

export default initializePassword;
