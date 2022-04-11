const bCrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const usuarios = require('../models/Users.js');
const userObj = new usuarios();
const nodeMailer = require('./Nodemailer.js');
require('dotenv').config();
const logger = require('./Logger.js');

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password)
}

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
} 

module.exports = function passportConfig(passport) {
  passport.use(
    'signup',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField:'usernameRegistro',
        passwordField:'passwordRegistro'
      },
      (req, email, pass, done) => {
        (async() => {
          try {
            let user = await userObj.getCustom([{fieldName: 'email', value: email}],{},1);

            if (user[0]) {
              throw "el usuario ya existe!";
            }

            let newUser = {
              email: email,
              password: createHash(pass),
              nombre: req.body.nombreRegistro,
              apellido: req.body.apellidoRegistro,
              direccion: req.body.direccionRegistro,
              edad: req.body.edadRegistro,
              telefono: req.body.telefonoRegistro,
              telefonoInt: req.body.telefonoRegistroInt,
              foto: req.body.foto
            }

            let createdUser = await userObj.save(newUser);

            if(!createdUser){
              throw "error al crear el usuario";
            }else{
              const objMailer = new nodeMailer(process.env.mail_origin,process.env.mail_pass,process.env.mail_port,process.env.mail_mode);
              await objMailer.sendMailNewRegistration(newUser);
              return done(null, createdUser);
            }
          } catch (err) {
            logger.error('Error al hacer el registro: ' + err)
            return done(null, false)
          }
          
        })();
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy((username, password, done) => {
      (async() => {
        try {
          let user = await userObj.getCustom([{fieldName: 'email', value: username}],{},1);
          if (!user[0]) {
            logger.debug('el usuario no existe!');
            return done(null, false);
          }

          if (!isValidPassword(user[0], password)) {
            logger.debug('contraseña invalida!');
            return done(null, false);
          }
    
          return done(null, user[0].id);

        } catch (err) {
          logger.error('Error al hacer el login: ' + err)
          return done(err)
        }
      })();
    })
  )
  
  passport.deserializeUser((id, done) => {
    (async() => {
      let user = await userObj.getById(id);
      if(!user){
        return done('no se encontro el usuario', null)
      }else{
        return done(null, user);
      }
    })();
  })
  
  passport.serializeUser((idUser, done) => {
    done(null, idUser)
  })
} 