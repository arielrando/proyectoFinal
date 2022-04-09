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

module.exports = class Ordenes extends generalDao {
    constructor(){
        switch (DBdefault) {
            case 'mongoDB':
                super('ordenes',esquema);
            break;
            case 'firebase':
                super('ordenes');
            break;
            default:
                super('ordenes',esquema);
            break;
        }
    }
}