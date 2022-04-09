module.exports = class MongoDBclient {
    constructor(tabla, esquema){
        let {optionsMongoDB} = require('../../config.js');
        const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
        const mongoose = require('mongoose');
        this.mongooseClient = mongoose;
        (async() => {
            this.connection =  await mongoose.connect(optionsMongoDB.url);
            this.tabla = tabla;
            this.esquemaTabla = new mongoose.Schema(esquema);

            this.esquemaTabla.options.toObject = {
                transform: function(doc, ret, options) {
                    ret.id = ret._id.toString();
                    return ret;
                }
            };
            this.esquemaTabla.options.toJSON = {
                transform: function(doc, ret, options) {
                    ret.id = ret._id.toString();
                    return ret;
                }
            };
            this.esquemaTabla.plugin(mongooseLeanVirtuals);
            try {
                this.modeloTabla = mongoose.model(tabla);
              } catch (error) {
                this.modeloTabla = mongoose.model(tabla, this.esquemaTabla);
              }
            
        })();
    }

    static async inicializarTablas(){
        try{
            let {optionsMongoDB} = require('../../config.js');
            const mongoose = require('mongoose');
            await mongoose.connect(optionsMongoDB.url);
        
            let colecciones = await mongoose.connection.db.listCollections().toArray();
            let buscado = colecciones.find(x => x.name == 'productos');
            if(!buscado){
                mongoose.connection.db.collection('productos').insertMany([
                    {codigo:"001",nombre:"Escuadra",fechaCreacion: Date(),fechaModificacion: Date(),descripcion:null,precio:123.45,stock:20,foto:"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"	},	
                    {codigo:"002",nombre:"Calculadora",fechaCreacion: Date(),fechaModificacion: Date(),descripcion:null,precio:234.56,stock:54,foto:"https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png"	},	
                    {codigo:"003",nombre:"Globo Terraqueo",fechaCreacion: Date(),fechaModificacion: Date(),descripcion:null,precio:345.67,stock:127,foto:"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png"	}
                ]);
            }
            let buscadoUsers = colecciones.find(x => x.name == 'users');
            if(!buscadoUsers){
                mongoose.connection.db.collection('users').insertMany([
                    {email:"admin@admin.com",password:"$2b$10$2Hwd.GFUgskhlmr4xH8Fqey.NtCNerdMf.hy2Etz1MvujUMcVrPKO",nombre: "admin",apellido: "admin",direccion: "admin 123",edad:36,telefono:"222555666",telefonoInt:"54222555666",foto:"admin.jpg",fechaCreacion: Date(),fechaUltimoLogin: Date(), admin: true},	
                    {email:"test@test.com",password:"$2b$10$nY8dyJ/LbpnjhHIstkmQ9.xv8.21lmhXZvtHXIRPmX.3uAcVMitKG",nombre: "test",apellido: "test",direccion: "test 123",edad:30,telefono:"222555666",telefonoInt:"54222555666",foto:"test.jpg",fechaCreacion: Date(),fechaUltimoLogin: Date()}
                ]);
            }
        }catch(err){
            console.log('no se pudieron inicializar las tablas: ',err);
        }
    }

    async save(item){
        try{
            const objeto = new this.modeloTabla(item);
            let resultado = null;
            resultado = await objeto.save();
            return resultado.id.toString();
        }catch(err){
            console.log('No se pudo grabar el dato en la tabla ',this.tabla,': ',err);
        }
    }

    async getById(num){
        try{
            if (num.match(/^[0-9a-fA-F]{24}$/)) {
                let resultado = await this.modeloTabla.find({ _id: num }).lean({ virtuals: true });
                /*delete resultado[0]._id;
                delete resultado[0].__v;*/
                return resultado[0];
            }else{
                return null;
            }
        }catch(err){
            console.log('No se pudo buscar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async getCustom(arrayCustom, cantResultados = 0){
        try{
            let query = {};
            if(arrayCustom.length>0){
                query = {
                    '$and': []
                };
                if(arrayCustom.length) {
                    for (let i = 0; i < arrayCustom.length; i++) {
                        let aux = {};
                        aux[arrayCustom[i].fieldName] = arrayCustom[i].value;
                        query['$and'].push(aux);
                    }
                };
            }
            
            let resultado = await this.modeloTabla.find(query);
            if(isNaN(cantResultados)){
                throw "La cantidad de resultados debe ser un numero valido" ;
            }
            if(cantResultados>0){
                resultado = resultado.slice(0, cantResultados);
            }
            return resultado;
        }catch(err){
            console.log('No se pudo buscar el dato ',JSON.stringify(arrayCustom),' de la tabla ',this.tabla,': ',err);
        }
    }

    async getAll(){
        try{
            let resultado = await this.modeloTabla.find().lean({ virtuals: true });
            return resultado;
        }catch(err){
            console.log('No se pudo obtener los datos de la tabla ',this.tabla,' de la base de datos: ',err);
        }
    }

    async editById(num,item){
        try{
            if (num.match(/^[0-9a-fA-F]{24}$/)) {
                let buscado = await this.modeloTabla.find({ _id: num });
                if(buscado[0]){
                    let resultado = await this.modeloTabla.updateOne({_id: num},item);
                    if(resultado.acknowledged){
                        item.id = num;
                        return item;
                    }else{
                        return null
                    }
                }else{
                    return null;
                }
            }else{
                console.log('ID de item invalido!');
                return null;
            }
        }catch(err){
            console.log('No se pudo buscar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async deleteById(num){
        try{
            if (num.match(/^[0-9a-fA-F]{24}$/)) {
                let buscado = await this.modeloTabla.find({ _id: num });
                if(buscado[0]){
                    let resultado = await this.modeloTabla.deleteOne({_id: num});
                    if(resultado.deletedCount>0){
                        return true;
                    }else{
                        return null
                    }
                }else{
                    return null;
                }
            }else{
                console.log('ID de item invalido!');
                return null;
            }
        }catch(err){
            console.log('No se pudo buscar el dato ',num,' de la tabla ',this.tabla,': ',err);
        }
    }

    async deleteAll(){
        await this.modeloTabla.deleteMany({});
    }
}