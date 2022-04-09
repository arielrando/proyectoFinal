require('dotenv').config();

let generalDao;

switch (DBdefault) {
    case 'mongoDB':
        generalDao = require("../drivers/MongoDBclient.js");
    break;
    case 'firebase':
        generalDao = require("../drivers/Firebaseclient.js");
    break;
    default:
        generalDao =  require("../drivers/MongoDBclient.js");
    break;
}

module.exports = generalDao;