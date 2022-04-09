const apiCarrito = new Ruta();
const carrito = require('../clases/models/Cart.js');
const carrApi = new carrito();
const Ordenes = require('../clases/models/Orders.js');
const ordApi = new Ordenes();
const nodeMailer = require('../clases/utils/Nodemailer.js');
require('dotenv').config();

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send(`{"mensajeError":"No esta logueado!"}`);
    }
}

apiCarrito.post('/', loggedIn, (req, res)=>{
    (async() => {
        if(!carritoId){
            if(carritoId = await carrApi.create(req.user.id)){
                res.send(`{"mensajeExito":"Carrito creado","itemNuevo":${carritoId}}`);
            }else{
                res.send(`{"mensajeError":"No se creo el carrito"}`);
            }
        }else{
            res.send(`{"mensajeExito":"El carrito ya existe","itemNuevo":${carritoId}}`);
        }
      })();
})

apiCarrito.delete('/', loggedIn, (req, res)=>{
    (async() => {
        if(!carritoId){
            res.send(`{"mensajeError":"No hay carrito"}`);
        }else{
            let buscado = await carrApi.getById(carritoId);
            if(buscado){
                await carrApi.deleteById(carritoId);
                carritoId = null;
                res.send(`{"mensajeExito":"Carrito borrado"}`);
            }else{
                res.send(`{"mensajeError":"No se borrar el carrito"}`);
            }
        }
      })();
})

apiCarrito.get('/productos', loggedIn, (req, res)=>{
    (async() => {
        if(carritoId){
            let buscado = await carrApi.getProductsById(carritoId);
            if(buscado){
                res.send(JSON.stringify(buscado));
            }else{
                res.send(`{"mensajeError":"No exite dicho carrito"}`);
            }
        }else{
            res.send(`{"mensajeError":"No hay carrito"}`);
        }
        
      })();
})

apiCarrito.post('/productos', loggedIn, (req, res)=>{
    (async() => {
        let resultado = await carrApi.addProduct(carritoId,req.body,req.user.id);
        if(resultado.status === 1){
            res.send(`{"mensajeExito":"Producto ${req.body.id} fue agregado al carrito ${carritoId}"}`);
        }else{
            res.send(`{"mensajeError":"${resultado.mensaje}"}`);
        }
    })();
})

apiCarrito.delete('/productos/:producto', loggedIn, (req, res)=>{
    (async() => {
        let resultado = await carrApi.deleteProduct(carritoId,req.params.producto);
        if(resultado.status === 1){
            res.send(`{"mensajeExito":"Producto ${req.params.producto} fue borrado del carrito ${carritoId}"}`);
        }else{
            res.send(`{"mensajeError":"${resultado.mensaje}"}`);
        }
      })();

})

apiCarrito.get('/', loggedIn, (req, res)=>{
    (async() => {
        let todos = await carrApi.getAll();
        if(todos){
            res.send(JSON.stringify(todos));
        }else{
            res.send(`{"mensajeError":"No hay carritos"}`);
        }
      })();
})

apiCarrito.get('/finalizar', loggedIn, (req, res)=>{
    (async() => {
        let carrito = await carrApi.getProductsById(carritoId);
        let hayProductos = false;
        if(carrito && carrito.length>0){
            hayProductos = true;
        }
        if(!req.user){
            res.send({status:'error',msg:'Usted no deberia estar aqui!'})
        }
        else if(!hayProductos){
            res.send({status:'error',msg:'no hay productos en el carrito!'})
        }else{
            let fullCarrito = await carrApi.getById(carritoId);
            delete fullCarrito.id;
            let newOrder = ordApi.save(fullCarrito);
            const objMailer = new nodeMailer(process.env.mail_origin,process.env.mail_pass,process.env.mail_port,process.env.mail_mode);
            await objMailer.sendMailNewOrder(carrito,req.user,newOrder);
            await carrApi.deleteById(carritoId);
            carritoId = null;
            res.send({status:'ok'})
        }
      })();
})

module.exports = apiCarrito;