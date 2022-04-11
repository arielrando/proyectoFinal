require('dotenv').config();

const optionsMongoDB = {
  url: process.env.mongodbUrl
}

const optionsFirebase = {
  conexion : {
    type: "service_account",
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.client_x509_cert_url
  }
}

 function inicializarTablas(db){
  (async() => {
    switch (db) {
        case 'mongoDB':
            const MongoDBclient = require('./clases/drivers/MongoDBclient.js');
            const mongoose = require('mongoose');
            global.mongooseConnection =  await mongoose.connect(optionsMongoDB.url);
            await MongoDBclient.inicializarTablas();
        break;
        case 'firebase':
            const Firebaseclient = require('./clases/drivers/Firebaseclient.js');
            await Firebaseclient.inicializarTablas();
        break;
        default:
            const DefaultDBclient = require('./clases/drivers/MongoDBclient.js');
            await DefaultDBclient.inicializarTablas();
        break;
    }
})();
}

module.exports = {
    optionsMongoDB,
    optionsFirebase,
    inicializarTablas
};