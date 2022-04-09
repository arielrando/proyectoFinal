const { createTransport } = require('nodemailer');
const logger = require('./Logger.js');
require('dotenv').config();

module.exports = class nodeMailer {
    constructor(origin, pass, port, mode){
        let objTransporter = {
            port: port,
            auth: {
                user: origin,
                pass: pass
            }
        }
        switch (mode) {
            case 'ethereal':
                objTransporter.host= 'smtp.ethereal.email'
                break;
            case 'gmail':
                objTransporter.service= 'gmail'
                break;
            default:
                objTransporter.host= 'smtp.ethereal.email'
                break;
        }
        this.transporter = createTransport(objTransporter);
        this.origin = origin;
    }

    async sendMail(receiver,subject,body,sender='',html=false){
        try {
            if(!sender){
                sender = this.origin;
            }
            const mailOptions = {
                from: sender,
                to: receiver,
                subject: subject
             }

             if(html){
                mailOptions.html = body;
             }else{
                mailOptions.text = body;
             }

            const info = await this.transporter.sendMail(mailOptions)
            logger.info(info)
         } catch (error) {
            logger.error(error)
         }
    }

    async sendMailNewRegistration(userData){
        let body=`
            <h1 style="color: blue;">Nuevo usuario</h1>
                <ul>
                    <li>email: ${userData.email}</li>
                    <li>nombre: ${userData.nombre}</li>
                    <li>apellido: ${userData.apellido}</li>
                    <li>direccion: ${userData.direccion}</li>
                    <li>edad: ${userData.edad}</li>
                    <li>telefono: ${userData.telefono}</li>
                </ul>
        `
        await this.sendMail(process.env.mail_admin,'Nuevo registro',body,'',true);
    }

    async sendMailNewOrder(orderData, userData, newOrder){
        let stringProducts ='';
        let total = 0;
        orderData.forEach(function (element, index) {
            stringProducts += `<li>${element.title} - cantidad:${element.cantidad} - precio:${element.price}</li>`
            total += element.cantidad * element.price;
        });
        let body=`
            <h1 style="color: blue;">nuevo pedido de ${userData.email} con el codigo ${newOrder}</h1>
                <h3>productos</h3>
                <ul>
                    ${stringProducts}
                </ul>
                <h3>Total: ${total}</h3>
        `
        await this.sendMail(process.env.mail_admin,'Nuevo pedido',body,'',true);
    }
}