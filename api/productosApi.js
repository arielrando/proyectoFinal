const apiProductos = new Ruta();
const producto = require('../clases/models/Products.js');
const prod = new producto();
const logger = require('../clases/utils/Logger.js');

apiProductos.get('/',(req, res)=>{
    (async() => {
        let todos = await prod.getAll();
        if(todos.length>0){
            res.send(JSON.stringify(todos));
        }else{
            res.send(`{"mensajeError":"No hay productos"}`);
        }
      })();
})

apiProductos.get('/:id',(req, res)=>{
    (async() => {
        let buscado = await prod.getById(req.params.id);
        if(buscado){
            res.send(JSON.stringify(buscado));
        }else{
            res.send(`{"mensajeError":"No exite dicho producto"}`);
        }
      })();
})

apiProductos.post('/',(req, res)=>{
    if(req.isAuthenticated() && req.user.admin){
        (async() => {
            let nuevo = await prod.save(req.body);
            if(nuevo){
                res.send(`{"mensajeExito":"Producto creado","itemNuevo":"${nuevo}"}`);
            }else{
                logger.error("productosApi: No se creo el producto");
                res.send(`{"mensajeError":"No se creo el producto"}`);
            }
          })();
    }else{
        logger.error("productosApi: ruta / método POST no autorizada");
        res.send(`{ "error" : -1, "mensajeError": ruta / método POST no autorizada}`);
    }
})

apiProductos.put('/:id',(req, res)=>{
    if(req.isAuthenticated() && req.user.admin){
        (async() => {
            let buscado = await prod.editById(req.params.id,req.body);
            if(buscado){
                res.send(JSON.stringify(buscado));
            }else{
                res.send(`{"mensajeError":"No exite dicho producto"}`);
            }
        })();
    }else{
        logger.error("productosApi: ruta /id método PUT no autorizada");
        res.send(`{ "error" : -1, "mensajeError": "ruta /id método PUT no autorizada"}`);
    }
})

apiProductos.delete('/:id',(req, res)=>{
    if(req.isAuthenticated() && req.user.admin){
        (async() => {
            let buscado = await prod.getById(req.params.id);
            if(buscado){
                let result = await prod.deleteById(req.params.id);
                if(result){
                    res.send(`{"mensajeExito":"Producto borrado"}`);
                }else{
                    logger.error("productosApi: El producto no se pudo borrar");
                    res.send(`{"mensajeError":"El producto no se pudo borrar"}`);
                }
            }else{
                res.send(`{"mensajeError":"El producto que quiere borrar no existe"}`);
            }
        })();
    }else{
        logger.error("productosApi: ruta /id método DELETE no autorizada");
        res.send(`{ "error" : -1, "mensajeError": ruta /id método DELETE no autorizada}`);
    }
})

module.exports = apiProductos;