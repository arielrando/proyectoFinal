require('dotenv').config();

let usuariosDao;

switch (DBdefault) {
    case 'mongoDB':
        usuariosDao = require("../drivers/MongoDBclient.js");
    break;
    case 'firebase':
        usuariosDao = require("../drivers/Firebaseclient.js");
    break;
    default:
        usuariosDao =  require("../drivers/MongoDBclient.js");
    break;
}

module.exports = usuariosDao;