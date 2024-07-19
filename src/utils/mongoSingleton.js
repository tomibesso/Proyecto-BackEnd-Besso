import {connect} from "mongoose";
import { devLogger, prodLogger } from "./loggers.js";

const logger = process.env.LOGGER === 'production' ? prodLogger : devLogger

export class MongoSingleton {
    static #instance
    constructor(){
        connect(process.env.MONGO_URL)
    }

    static getInstance(){
        if(this.#instance){
            logger.info('Base de datos ya esta conectada')
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        logger.info('Base de datos conectada')
        return this.#instance
    }
}