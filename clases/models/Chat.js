require('dotenv').config();
const chatRepo = require('../repos/repoChat.js');

module.exports = class Chat extends chatRepo{
    constructor(mensaje = '', fecha = '', mail = '', nombre = '', apellido = '', edad = '', alias = '', avatar = ''){
        super();
        this.mensaje = mensaje;
        this.fecha = fecha;
        this.autor = {
            mail: mail,
            nombre: nombre,
            apellido: apellido,
            edad: edad,
            alias: alias,
            avatar: avatar
        }
    }

    async saveChat(){
        let chat = {
            autor: {
                mail: this.autor.mail,
                nombre: this.autor.nombre,
                apellido: this.autor.apellido,
                edad: this.autor.edad,
                alias: this.autor.alias,
                avatar: this.autor.avatar
              },
              mensaje: this.mensaje,
              fecha: this.fecha
        };

        await this.save(chat);
    }
}