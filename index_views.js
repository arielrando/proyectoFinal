const indexView = new Ruta();
const producto = require('./clases/models/Products.js');
const carrito = require('./clases/models/Cart.js');
const uploadImage = require('./clases/utils/UploadImage.js');
require('dotenv').config();

const prod = new producto();
const carr = new carrito();

indexView.get('/',(req, res) => {
    res.redirect(`/info`);
})

indexView.get('/instrucciones_api',(req, res) => {
    res.render('instrucciones_api.hbs');
});

indexView.get('/chat',(req, res) => {
    res.render('chat.hbs');
});

indexView.get('/info',(req, res) => {
    const objJson = {argv:JSON.stringify(process.argv.slice(2)),ruta:process.cwd(),memory:JSON.stringify(process.memoryUsage()),process:process}
    res.render('info.hbs',objJson);
});

indexView.post('/subirImagen',(req, res) => {
    uploadImage.uploadImage(req, res,'fotoRegistro','public/profilePics',1,function(result) {
        res.send(result);
    });
})

module.exports = indexView;