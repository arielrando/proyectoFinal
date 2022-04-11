const logger = require("../utils/Logger.js");
module.exports = class Firebaseclient {
    constructor(tabla){
        this.admin = require("firebase-admin");
        let {optionsFirebase} = require('../../config.js');
        if (!this.admin.apps.length) {
            this.admin.initializeApp({
                credential: this.admin.credential.cert(optionsFirebase.conexion)
            });
         }else {
            this.admin.app(); 
         }
        
        this.db = this.admin.firestore();
        this.tabla = tabla;
        this.collection = this.db.collection(this.tabla);
    }

    static async inicializarTablas(){
        try{
            const admin = require("firebase-admin");
            let {optionsFirebase} = require('../../config.js');
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(optionsFirebase.conexion)
                });
            }else {
                admin.app(); 
            }
            const db = admin.firestore();
            let snapshot = await db.collection('productos').limit(1).get();
            if (snapshot.size == 0) {
                (async() => {
                    await db.collection('productos').add({codigo:"001",nombre:"Escuadra",fechaCreacion: Date(),fechaModificacion: Date(),descripcion:null,precio:123.45,stock:20,foto:"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"	});
                    await db.collection('productos').add({codigo:"002",nombre:"Calculadora",fechaCreacion: Date(),fechaModificacion: Date(),descripcion:null,precio:234.56,stock:54,foto:"https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png"	})
                    await db.collection('productos').add({codigo:"003",nombre:"Globo Terraqueo",fechaCreacion: Date(),fechaModificacion: Date(),descripcion:null,precio:345.67,stock:127,foto:"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png"	})
                })();
            }
            let snapshotUsers = await db.collection('users').limit(1).get();
            if (snapshotUsers.size == 0) {
                (async() => {
                    await db.collection('users').add({email:"admin@admin.com",password:"$2b$10$2Hwd.GFUgskhlmr4xH8Fqey.NtCNerdMf.hy2Etz1MvujUMcVrPKO",nombre: "admin",apellido: "admin",direccion: "admin 123",edad:36,telefono:"222555666",telefonoInt:"54222555666",foto:"admin.jpg",fechaCreacion: Date(),fechaUltimoLogin: Date(), admin: true});
                    await db.collection('users').add({email:"test@test.com",password:"$2b$10$nY8dyJ/LbpnjhHIstkmQ9.xv8.21lmhXZvtHXIRPmX.3uAcVMitKG",nombre: "test",apellido: "test",direccion: "test 123",edad:30,telefono:"222555666",telefonoInt:"54222555666",foto:"test.jpg",fechaCreacion: Date(),fechaUltimoLogin: Date()})
                })();
            }
        }catch(err){
            logger.error('no se pudieron inicializar las tablas: ',err);
        }
    }

    async getById(num) {
        try{
            const doc = await this.collection.doc(num).get();
            if(doc.data()){
                return { id: doc.id, ...doc.data() } ;
            }else{
                return null;
            }
        }catch(err){
            logger.error('No se pudo buscar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async getCustom(arrayCustom, orden=null, cantResultados = 0) {
        try{
            let doc = this.collection;
            if(arrayCustom.length>0){
                    for (let i = 0; i < arrayCustom.length; i++) {
                        doc = doc.where(arrayCustom[i].fieldName,'==',arrayCustom[i].value)
                    }
            }
            if(orden && orden.fieldName){
                if(!orden.desc){
                    doc = doc.orderBy(orden.fieldName);
                }else{
                    doc = doc.orderBy(orden.fieldName, 'desc');
                }
            }
            if(isNaN(cantResultados)){
                throw "The number of 'results searched' must be a valid number" ;
            }
            if(cantResultados>0){
                doc = doc.limit(cantResultados);
            }
            const snapshot = await doc.get();
            let resultado = Array();
            snapshot.forEach(doc => {
                resultado.push({ id: doc.id, ...doc.data() })
            })
            
            return resultado;
        }catch(err){
            logger.error('No se pudo buscar el dato de la tabla ',this.tabla,': ',err);
        }
    }

    async getAll() {
        try{
            const snapshot = await this.collection.get();
            const respuestas = Array();
            snapshot.forEach(doc => {
                respuestas.push({ id: doc.id, ...doc.data() })
            })
            if(respuestas){
                return respuestas;
            }else{
                return null;
            }
        }catch(err){
            logger.error('No se pudo obtener los datos de la tabla ',this.tabla,' de la base de datos: ',err);
        }
    }

    async save(item) {
        try{
            const guardado = await this.collection.add(item);
            if(guardado.id){
                return guardado.id;
            }else{
                return null;
            }
        }catch(err){
            logger.error('No se pudo grabar el dato en la tabla ',this.tabla,': ',err);
        }
    }

    async editById(num, item) {
        try{
            let respuesta = null;
            const doc = await this.collection.doc(num).get();
            if(doc.data()){
                await this.collection.doc(num).set(item).then((resultado) => {
                    if(resultado._writeTime){
                        item.id = num;
                        respuesta = item;
                    }
                }).catch(function(error) {
                    logger.error(error);
                });
            }
            return respuesta;
        }catch(err){
            logger.error('No se pudo modificar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async deleteById(num) {
        try{
            let respuesta = false;
            const doc = await this.collection.doc(num).get();
            if(doc.data()){
                await this.collection.doc(num).delete().then((resultado) => {
                    if(resultado._writeTime){
                        respuesta = true
                    }
                }).catch(function(error) {
                    logger.error(error);
                });
            }
            return respuesta;
        }catch(err){
            logger.error('No se pudo modificar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async deleteAll(){
        try{
            await this.collection.get().then(querySnapshot => {
                querySnapshot.docs.forEach(snapshot => {
                    snapshot.ref.delete();
                })
            })
        }catch(err){

        }
    }
}