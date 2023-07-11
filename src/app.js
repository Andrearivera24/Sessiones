//---- Modules
import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';

//---- Rutas
import productRouter from './routers/products.router.js';
import cartRouter from './routers/carts.router.js';
import sessionRouter from './routers/session.router.js';
import userRouter from './routers/user.router.js';
import initializePassword from './config/passport.config.js';
const app = express();

//uso middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser('B2zdY3B$pHmxW%'));

//uso sesiones
app.use(session({

    store: MongoStore.create({
        mongoUrl:'mongodb+srv://AndreaRivera24:acrs241097@cluster0.ggiy5uv.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: {useNewUrlParser:true},
        ttl: 6000,
    }),
    secret: 'B2zdY3B$pHmxW%',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize()); //permite que passport use express
app.use(passport.session()); // Permite trabajar las sesiones de passport con las sesiones de mongo.

initializePassword();

//seteo estructura de handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', 'views/'); //seteo la vista en la carpeta raiz views
app.set('view engine', 'handlebars');

// Uso las rutas.
app.use ('/api/carts', cartRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter); //método post del formulario
app.use('/', sessionRouter)

//Estructura de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "views/"); //seteo la vista de la carpeta raíz vistas
app.set("view engine", "handlebars");

//Conecto el servidor con mongoose
mongoose.connect('mongodb+srv://AndreaRivera24:acrs241097@cluster0.ggiy5uv.mongodb.net/?retryWrites=true&w=majority');



//Inicializo el servidor

const webServer = app.listen(8080, ()=>{
    console.log('Listening on port 8080');
})

//inicio el socket.io
const io = new Server(webServer);
// cuándo haya una conexión, emita todos los mensajes.
io.on('connection', async (socket)=>{
    socket.emit('messages', await messageService.getMessages());

    // Ecucho los mensajes que envía al cliente, lo agrego al array y los emito actualizados a todos. 
    socket.on('message', async (msj)=>{
        console.log(msj);
        await messageService.addMessage(msj);
        io.emit('messages', await messageService.getMessages())
    });
   
});

