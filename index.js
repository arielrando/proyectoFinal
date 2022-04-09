const argv = require('minimist');
require('dotenv').config();
const express = require('express');
const cluster = require('cluster')
const {Router} = express;
const logger = require('./clases/utils/Logger.js');

global.Ruta = Router;
global.carritoId = null;
global.DBdefault = process.env.DBdefault;

const optionsArgv = {
    default: {
        puerto: process.env.PORT || 8080,
        modo: 'FORK',
        database: ''
    },
    alias: {
        p: 'puerto',
        m: 'modo',
        d: 'database'
    }
}

const argumentos = argv(process.argv.slice(3),optionsArgv);

if(argumentos.database){
    DBdefault = argumentos.database;
}

const {inicializarTablas} = require('./config.js');
(async() => {
    await inicializarTablas(DBdefault);
})();

const numCPUs = require('os').cpus().length

if (cluster.isPrimary && argumentos.modo=='CLUSTER') {
    logger.debug(numCPUs)
    logger.debug(`PID MASTER ${process.pid}`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        logger.debug('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })
}else {
    const indexView = require('./index_views.js');

    const {app, httpServer, io} = require('./clases/app.js');

    function myMiddleware (req, res, next) {
        logger.trace(`ruta ${req.url} método ${req.method}`);
        next()
     }
     
     app.use(myMiddleware)

    app.use('/',indexView);

    app.use((req, res, next) => {
        logger.warn(`ruta ${req.url} método ${req.method} no existe`);
        res.send(`{ "error" : -1, "descripcion": "ruta ${req.url} método ${req.method} no existe"}`);
    });

    httpServer.listen(argumentos.puerto, () => logger.trace(`SERVER ON ${argumentos.puerto} - PID ${process.pid} - ${new Date().toLocaleString()}`)) // El servidor funcionando en el puerto 3000
    httpServer.on('error', (err) =>logger.error(err));
}