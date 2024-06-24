import dotenv from "dotenv";
import { program } from '../utils/commander.js';
import { MongoSingleton } from '../utils/mongoSingleton.js';

const { mode } = program.opts()
dotenv.config({
    path: mode === 'production' ? './.env.production' : './.env.development'
});

export const objectConfig = {
    port: process.env.PORT || 8080,
    privateKey: process.env.PRIVATE_KEY,
    mongoURL: process.env.MONGO_URL,
    cookieParserSign: process.env.COOKIE_PARSER_SIGN,
    sessionKey: process.env.SESSION_SECRET_KEY,
    userAdmin: process.env.USER_ADMIN,
    userPassword: process.env.USER_PASSWORD    
}

export const connectDb = () => {
    MongoSingleton.getInstance()
}

