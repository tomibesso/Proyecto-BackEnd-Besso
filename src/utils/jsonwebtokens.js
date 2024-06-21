import jwt from 'jsonwebtoken';
import { objectConfig } from '../config/index.js';

const { privateKey } = objectConfig

export const generateToken = (user) => jwt.sign({user}, privateKey, {expiresIn: '24h'});

export const authTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader) return res.status(401).send({status: "error", error: "No está autenticado"})

    const token = authHeader.split(' ')[1]
    jwt.verify(token, privateKey, (error, credential) => {
        if(error) return res.status(401).send({status: "error", error: "No está autorizado"})
            req.user = credential.user;
            next();
    })
}