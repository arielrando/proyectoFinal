const apiUsers = new Ruta();
const passport = require('passport');
const carrito = require('../clases/models/Cart.js');
const carr = new carrito();
require('../Clases/utils/Passport.js')(passport);

apiUsers.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        if(carritoId){
            carr.deleteById(carritoId);
            carritoId = null;
        }
        req.logout();
        res.send(`{"mensajeExito":"se a deslogueado satisfactopriamente"}`);
    }else{
        res.send(`{"mensajeError":"No se encuentra logueado"}`);
    }
})

apiUsers.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(req.user);
    }else{
        res.send(`{"mensajeError":"No se encuentra logueado"}`);
    }
})

apiUsers.get('/registro', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect(`/productos`);
    } else {
    res.render('registro_form.hbs');
    }
})

apiUsers.post('/login',(req, res)=>{
    passport.authenticate('login', function(err, user, info) {
        if (err) { res.send(`{"mensajeError":"no se pudo loguear"}`); }
        if (!user) { 
            res.send(`{"mensajeError":"usuario o contraseña incorrectos"}`); 
        }
        else{
            req.logIn(user, function(err) {
                if (err) { res.send(`{"mensajeError":"no se pudo loguear"}`); }
                res.send(`{"mensajeExito":"se a logueado satisfactopriamente"}`);
              });
            
        }
    })(req, res);
});

apiUsers.post('/registro',(req, res)=>{
    passport.authenticate('signup', function(err, user, info) {
        if (err) { res.send(`{"mensajeError":"no se pudo crear el usuario"}`); }
        if (!user) { 
            res.send(`{"mensajeError":"no se pudo crear el usuario"}`); 
        }
        else{
            if (req.isAuthenticated()) {
                req.logout();
            }
            req.logIn(user, function(err) {
                if (err) { res.send(`{"mensajeError":"no se pudo loguear"}`); }
                res.send(`{"mensajeExito":"Usuario creado satisfactoriamente"}`);
              });
            
        }
    })(req, res);
});

module.exports = apiUsers;