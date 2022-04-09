const multer = require('multer');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const logger = require('./Logger.js');

module.exports = class UploadImage {
    constructor(){

    }

    static uploadImage(req,res,fieldName,folder,maxSizeMB = 1, callb){
        try {
            let image = '';
            let storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, folder)
                },
                filename: function (req, file, cb) {
                    let extension = file.originalname.split('.').pop();
                    image = uuidv4()+"."+extension;
                    cb(null, image);
                }
              })
            const maxSize = maxSizeMB * 1000 * 1000;
                
            let upload = multer({ 
                storage: storage,
                limits: { fileSize: maxSize },
                fileFilter: function (req, file, cb){
                
                    let filetypes = /jpeg|jpg|png/;
                    let mimetype = filetypes.test(file.mimetype);
              
                    let extname = filetypes.test(path.extname(
                                file.originalname).toLowerCase());
                    
                    if (mimetype && extname) {
                        return cb(null, true);
                    }
                  
                    cb("Formato de archivo no permitido, debe ser un jpeg, jpg o png");
                  } 
            }).single(fieldName);  

            upload(req,res,function(err) {
  
                if (err instanceof multer.MulterError) {
                    logger.error(err.code);
                    switch(err.code){
                        case 'LIMIT_FILE_SIZE':
                            return callb({status:'error', msg:`archivo demasiado grande, no debe superar ${maxSizeMB}MB`});
                            break;
                        default:
                            return callb({status:'error', msg:'no se pudo cargar la imagen'});
                            break;
                    }
                } else if (err) {
                    logger.error(err);
                    return callb({status:'error', msg:err})
                }
                else {
                    return callb({status:'ok', image:image});
                }
            })
        } catch (error) {
            logger.error(error);
            return {status:'error', msg:'no se pudo cargar la imagen'};
        }
    }
}