require('dotenv').config();
const chatDao = require('../daos/generalDao.js');

let esquema = {
    mail: {type: String, required: true},
    fecha: {type: Date, default: Date()},
    timestamp: {type: String, default: Date.now()},
    mensaje: {type: String, required: true}
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