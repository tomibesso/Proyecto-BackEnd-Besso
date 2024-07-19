import { EError } from "../../service/errors/enums.js";
import { devLogger, prodLogger } from "../../utils/loggers.js"

const logger = process.env.LOGGER === 'production' ? prodLogger : devLogger

export const handleErrors = (error, req, res, next) => {
    logger.info('Error cause', error.cause);
    switch (error.code) {
        case EError.INVALID_TYPE_ERROR:
            return res.send({status: 'Error', error: error.name})
            break
        case EError.DATABATE_ERROR:
            return res.send({status: 'Error', error: error.name})
            break
        case EError.ROUTING_ERROR:
            return res.send({status: 'Error', error: error.name})
            break
        default:
            res.send({status: 'Error', error: 'Error no identificado'})
    }
}