const usuariosDao = require('../daos/usuariosDao.js');

let esquema = {
    email: {type: String, required: true},
    password: {type: String, required: true},
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    direccion: {type: String, required: true},
    edad: {type: Number, required: true},
    telefono: {type: String, required: true},
    telefonoInt: {type: String, required: true},
    foto: {type: String, required: true},
    admin: {type: String, required: false, default: false},
    fechaCreacion: {type: Date, default: Date.now},
    fechaUltimoLogin: {type: Date, default: Date.now}
};

module.exports = class Usuario extends usuariosDao{
    constructor(){
        switch (DBdefault) {
            case 'mongoDB':
                super('users',esquema);    
            break;
            case 'firebase':
                super('users');
            break;
            default:
                super('users',esquema);  
            break;
        }
    }
}