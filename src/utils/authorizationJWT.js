export const authorization = role => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({error: "No está autenticado"})
        if (req.user.user.role !== role) return res.status(401).send({error: "No está autorizado"})
        next()
    }
}