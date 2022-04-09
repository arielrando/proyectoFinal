const apiOrdenes = new Ruta();
const Ordenes = require('../clases/models/Orders.js');
const ordApi = new Ordenes();
require('dotenv').config();

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send(`{"mensajeError":"No esta logueado!"}`);
    }
}

apiOrdenes.get('/:id', loggedIn, (req, res)=>{
    (async() => {
        let buscado = await ordApi.getById(req.params.id);
        if(buscado){
            if(req.user.id == buscado.user){
                res.send(JSON.stringify(buscado));
            }else{
                res.send(`{"mensajeError":"No exite dicha orden"}`);
            }
        }else{
            res.send(`{"mensajeError":"No exite dicha orden"}`);
        }
      })();
})

apiOrdenes.get('/', loggedIn, (req, res)=>{
    (async() => {
        let buscado = await ordApi.getCustom([{fieldName: "user",value: req.user.id}]);
        if(buscado){
            res.send(JSON.stringify(buscado));
        }
      })();
})

module.exports = apiOrdenes;