require('dotenv').config();
const generalDao = require('../daos/generalDao.js');

const mongooseAux = require('mongoose');
const arrayProductos = new mongooseAux.Schema({
    idProducto: {type: String, required: true},
    cantidad: {type: Number, default: 0},
    fechaCreacion: {type: Date, default: Date.now}
});
let esquema = {
    fechaCreacion: {type: Date, default: Date.now},
    fechaModificacion: {type: Date, default: Date.now},
    user: {type: String, required: true},
    productos: [arrayProductos]
};

module.exports = class Carrito extends generalDao {
    constructor(){
        switch (DBdefault) {
            case 'mongoDB':
                super('carritos',esquema);
            break;
            case 'firebase':
                super('carritos');
            break;
            default:
                super('carritos',esquema);
            break;
        }
        this.moment = require('moment');  
        let productos = require('./Products.js');
        this.prod = new productos;
    }

    async create(user){
        try{
            let carrito = {};
            carrito.productos = [];
            carrito.user = user;
            if(DBdefault=='archivoTexto'){
                carrito.fechaCreacion = this.moment().format('DD/MM/YYYY HH:mm:ss');
                carrito.fechaModificacion = this.moment().format('DD/MM/YYYY HH:mm:ss');
            }
            if(DBdefault=='firebase'){
                carrito.fechaCreacion = Date();
                carrito.fechaModificacion = Date();
            }
            let resultado = await this.save(carrito);
            return resultado;
        }catch(err){
            console.log('No se pudo grabar el archivo de los carritos: ',err);
        }
    }

    async getProductsById(num){
        try{
            let test = await this.getById(num);
            let result = null;
            if(test){
                result = [];
                await Promise.all(test.productos.map(async (elementProducto) => {
                    let prodAux = await this.prod.getById(elementProducto.idProducto);
                    if(prodAux){
                        elementProducto.codigo = prodAux.codigo;
                        elementProducto.title = prodAux.nombre;
                        elementProducto.price = prodAux.precio;
                        elementProducto.thumbnail = prodAux.foto;
                        result.push(elementProducto);
                    }
                }));
            }
            return result;
        }catch(err){
            console.log('No se encontro el carrito ',num,': ',err);
        }
    }

    async addProduct(carrito,producto, user){
        try{
            if(!carrito){
                carritoId = await this.create(user);
                carrito = carritoId;
            }

            if(!producto.cantidad || isNaN(producto.cantidad)){
                producto.cantidad = 1;
            }
            let buscado = await this.prod.getById(producto.id);
            if(buscado){
                let result = await this.getById(carrito);
                if(result){
                    let indexProducto = result.productos.findIndex(x => x.idProducto === producto.id);
                    if(indexProducto!= -1){
                        result.productos[indexProducto].cantidad+=producto.cantidad;
                    }else{
                        let productoNuevo= {}
                        productoNuevo.idProducto = producto.id;
                        productoNuevo.cantidad = producto.cantidad;
                        productoNuevo.fecha = this.moment().format('DD/MM/YYYY HH:mm:ss');
                        if(result.productos && result.productos.length>0){
                            result.productos.push(productoNuevo);
                            
                        }else{
                            result.productos = [productoNuevo];
                        }
                    }
                    let resultado = await this.editById(carrito,result);
                    if(resultado){
                        return {status:1, mensaje:"El producto "+producto.id+" fue agregado al carrito"+carrito}
                    }else{
                        return {status:2, mensaje:"El carrito "+carrito+" no se pudo grabar"}
                    }
                }else{
                    return {status:2, mensaje:"El carrito "+carrito+" no existe"}
                }
            }else{
                return {status:2, mensaje:"El producto "+producto.id+" no existe"}
            }
        }catch(err){
            console.log('No se pudo agregar el producto ',producto.id,' al carrito',carrito,': ',err);
        }
    }

    async deleteProduct(carrito,producto){
        try{
            let buscado = await this.prod.getById(producto);
            if(buscado){
                let result = await this.getById(carrito);
                if(result){
                    let indexProducto = result.productos.findIndex(x => x.idProducto == producto);
                    if(indexProducto!= -1){
                        result.productos.splice(indexProducto, 1);
                    }else{
                        return {status:2, mensaje:"El producto "+producto+" no existe en el carrito "+carrito}
                    }
                    this.editById(carrito,result);
                    return {status:1, mensaje:"El producto "+producto+" fue borrado del carrito"+carrito}
                }else{
                    return {status:2, mensaje:"El carrito "+carrito+" no existe"}
                }
            }else{
                return {status:2, mensaje:"El producto "+producto+" no existe"}
            }
        }catch(err){
            console.log('No se pudo agregar el producto ',producto,' al carrito',carrito,': ',err);
        }
    }
}