import {connect} from "mongoose"

export class MongoSingleton {
    static #instance
    constructor(){
        connect(process.env.MONGO_URL)
    }

    static getInstance(){
        if(this.#instance){
            console.log('base de datos ya esta conectada')
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        console.log('base de datos conectada')
        return this.#instance
    }
}