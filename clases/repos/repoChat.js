require('dotenv').config();
const chatDao = require('../daos/chatDao.js');

const mongooseAux = require('mongoose');
const esquemaAutor = new mongooseAux.Schema({
    mail: {type: String, required: true},
    nombre: {type: String},
    apellido: {type: String},
    edad: {type: Number},
    alias: {type: String},
    avatar: {type: String}
});
let esquema = {
    fecha: {type: Date, default: Date.now},
    mensaje: {type: String, required: true},
    autor: {type: esquemaAutor, require: true}
};

module.exports = class repoChat extends chatDao{
    constructor(){
        switch (DBdefault) {
            case 'mongoDB':
                super('chats',esquema);
            break;
            case 'firebase':
                super('chats');
            break;
            default:
                super('chats',esquema);
            break;
        }
    }
}