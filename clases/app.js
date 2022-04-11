const moment = require('moment');  
const normalizr = require('normalizr');
const normalize = normalizr.normalize;
const schemaNormalizr = normalizr.schema;
const path = require('path');
const logger = require('./utils/Logger.js');

const express = require('express');
if(!global.DBdefault){
    global.DBdefault = 'firebase';
    const {Router} = express;
    global.Ruta = Router;
}
const session = require('express-session');
const MongoStore = require('connect-mongo');
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const handlebars = require("express-handlebars");
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const passport = require('passport');
require('./utils/Passport.js')(passport);

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const objchat = require('./models/Chat.js');
const chatRepo = require('./repos/repoChat.js');

app.use(express.static(path.join(__dirname,'../public')));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: path.join(__dirname,"../views/layouts"),
        partialsDir:path.join(__dirname,"../views/partials/")
    })
);

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://admin:1234@cluster0.8mbng.mongodb.net/mibase?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),
    secret: 'codercasa',
    resave: false,
    saveUninitialized: false ,
    cookie: {
        maxAge: 60000*30
    } 
}));

app.use(passport.initialize());
app.use(passport.session());

io.on('connection', (socket) => { 
    socket.on('grabarMensaje', data => {
        (async() => {
            data = JSON.parse(data);
            data.fecha = Date();
            data.timestamp  = Date.now();
            let chat = new objchat(data.mensaje, data.fecha, data.timestamp, data.mail);
            await chat.saveChat();
            let ahora = moment().format('DD/MM/YYYY HH:mm:ss');
            data.fecha = ahora;
            io.sockets.emit('mensajeNuevo', JSON.stringify(data));
          })();
    })

    socket.on('recuperarMensajes',data  => {
        (async() => {
            let chat = new chatRepo();
            let todos = await chat.getCustom([],{fieldName:"timestamp", desc:true},10);
            todos = todos.reverse()
            if(todos.length>0){
                const schemaAutor = new schemaNormalizr.Entity('autor',{},{idAttribute:'mail'});
                const schemaMensaje = new schemaNormalizr.Entity('mensaje',{autor: schemaAutor});
                const schemaMensajes = new schemaNormalizr.Entity('mensajes',{mensajes: [schemaMensaje]});
    
                const mensajes = normalize({id:'999',mensajes:todos},schemaMensajes);
                socket.emit('mensajesAnteriores',mensajes);
            }
        })();
    })
  
    socket.on('notificacion', data => {
        logger.debug(data);
    })
});

const {productosApi,carritoApi,usersApi, ordenesApi} = require('../api/index.js');

app.use('/api/productos', productosApi);
app.use('/api/carrito', carritoApi);
app.use('/api/ordenes', ordenesApi);
app.use('/api/users', usersApi);

module.exports = {
    app,
    httpServer,
    io
};