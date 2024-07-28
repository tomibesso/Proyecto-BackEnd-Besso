export const authorization = (...roles) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({error: "No está autenticado"})
        if (!roles.includes(req.user.user.role)) return res.status(401).send({error: "No está autorizado"})
        next()
    }
}