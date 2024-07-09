import { EError } from "../../service/errors/enums.js";

export const handleErrors = (error, req, res, next) => {
    console.log('Error cause', error.cause);
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