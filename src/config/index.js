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
    userPassword: process.env.USER_PASSWORD,
    persistence: process.env.PERSISTENCE,
    gmailUser: process.env.GMAIL_USER,
    gmailPass: process.env.GMAIL_PASS,
    gmailService: process.env.GMAIL_SERVICE,
    gmailPort: process.env.GMAIL_PORT,
    twilioSid: process.env.TWILIO_ACCOUNT_sID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioPhone: process.env.TWILIO_PHONE,
    logger: process.env.LOGGER
}

export const connectDb = () => {
    MongoSingleton.getInstance()
}

