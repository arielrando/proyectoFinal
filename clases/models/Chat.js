require('dotenv').config();
const chatRepo = require('../repos/repoChat.js');

module.exports = class Chat extends chatRepo{
    constructor(mensaje = '', fecha = '',timestamp = '', mail = ''){
        super();
        this.mensaje = mensaje;
        this.fecha = fecha;
        this.timestamp = timestamp;
        this.mail= mail
    }

    async saveChat(){
        let chat = {
              mail: this.mail,
              mensaje: this.mensaje,
              fecha: this.fecha,
              timestamp: this.timestamp
        };

        await this.save(chat);
    }
}