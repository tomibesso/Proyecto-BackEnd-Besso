import {connect} from "mongoose";
import { prodLogger, devLogger } from "./loggers.js";


export class MongoSingleton {
    static #instance
    constructor(){
        connect(process.env.MONGO_URL)
    }
    
    static getInstance(){
        const logger = process.env.LOGGER === 'PROD_LOGGER' ? prodLogger : devLogger
        if(this.#instance){
            logger.info('Base de datos ya esta conectada')
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        logger.info('Base de datos conectada')
        return this.#instance
    }
}