import multer from 'multer';
import {__dirname} from './utils.js';

// Configura la función de almacenamiento de multer
const storage = multer.diskStorage({
    // Define la carpeta de destino para guardar los archivos subidos
    destination: function(req, file, callback) {
        callback(null, __dirname+'/public/uploads'); // Define la carpeta de destino para guardar los archivos subidos
    },
    // Define el nombre del archivo al ser guardado
    filename: function(req, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`); // Asigna un nombre único al archivo subido, utilizando la fecha actual y el nombre original del archivo
    }
});

// Configura multer con las opciones de almacenamiento
export const uploader = multer({
    storage // Utiliza la función de almacenamiento configurada anteriormente
});
