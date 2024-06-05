export function auth(req, res, next) {
    if(req.sessions?.user?.admin) {
        return next()
    }

    return res.status(401).send('error de autorización')
}