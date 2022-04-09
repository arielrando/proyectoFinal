const twilio = require('twilio');
const logger = require('./Logger.js');
require('dotenv').config();

module.exports = class textMessage {
    constructor(accountSid, authToken){
        this.client = twilio(accountSid, authToken);
        this.twilio_number = process.env.twilio_number;
        this.twilio_number_whatsapp = process.env.twilio_number_whatsapp;
    }

    async sendText(body, to){
        try {
            const message = await this.client.messages.create({
               body: body,
               from: `+${this.twilio_number}`,
               to: `+${to}`
            })
            logger.info(message)
         } catch (error) {
            logger.error(error)
         }
         
    }

    async sendWhatsapp(body, to){
        try {
            const message = await this.client.messages.create({
               body: body,
               from: `whatsapp:+${this.twilio_number_whatsapp}`,
               to: `whatsapp:+${to}`
            })
            logger.info(message)
         } catch (error) {
            logger.error(error)
         }
         
    }
}