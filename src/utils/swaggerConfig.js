import { __dirname } from "../utils.js"
import swaggerJsdoc from "swagger-jsdoc"

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación del Proyecto BackEnd',
            description: 'API para documentar el proyecto de BackEnd'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

export const specs = swaggerJsdoc(swaggerOptions)