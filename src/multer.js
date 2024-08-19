import multer from 'multer';
import { __dirname } from './utils.js';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        let folder

        switch (req.body.type) {
            case "product": 
                folder = 'products';
                break;
            case "profile": 
                folder = 'profiles';
                break;
            default:
                folder = 'documents';
                break;
        }

        const uploadPath = path.join(__dirname, `/public/uploads/${folder}`);
        callback(null, uploadPath);
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

export const uploader = multer({
    storage
});

