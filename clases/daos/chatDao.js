require('dotenv').config();

let chatDao;

switch (DBdefault) {
    case 'mongoDB':
        chatDao = require("../drivers/MongoDBclient.js");
    break;
    case 'firebase':
        chatDao = require("../drivers/Firebaseclient.js");
    break;
    default:
        chatDao =  require("../drivers/MongoDBclient.js");
    break;
}

module.exports = chatDao;