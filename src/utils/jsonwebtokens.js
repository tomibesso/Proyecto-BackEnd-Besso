import jwt from 'jsonwebtoken';

export const PRIVATE_KEY = 'TokenSecreto'

export const generateToken = (user) => jwt.sign({user}, PRIVATE_KEY, {expiresIn: '24h'});

export const authTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader) return res.status(401).send({status: "error", error: "No está autenticado"})

    const token = authHeader.split(' ')[1]
    jwt.verify(token, PRIVATE_KEY, (error, credential) => {
        if(error) return res.status(401).send({status: "error", error: "No está autorizado"})
            req.user = credential.user;
            next();
    })
}