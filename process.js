import { devLogger, prodLogger } from "./src/utils/loggers.js";
const logger = process.env.LOGGER === 'production' ? prodLogger : devLogger

process.on('exit', code => {
    logger.info('Antes de salir de proceso', code);
})

process.on('uncaughtException', exception => {
    logger.error('Este atrapa todos los errores no controlados, una variable o funcion que no exista', exception);
})

process.on('message', message => {
    logger.info('Mandar mensajes a otro proceso');
})

logger.info("Ejecutando codigo");
logger.debug(tomi);
