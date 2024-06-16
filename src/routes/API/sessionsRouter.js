import {Router} from 'express';
import userManager from '../../dao/UserDAOMongo.js';
import { createHash, isValidPassword } from '../../utils/bcrypt.js';
import passport from 'passport';
import { generateToken, authTokenMiddleware, PRIVATE_KEY } from '../../utils/jsonwebtokens.js';
import CartManager from '../../dao/CartDAOMongo.js';

export const sessionsRouter = Router()
const userService = new userManager()
const cartsService = new CartManager()

sessionsRouter.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body

        if(!email || !password) return res.status(401).send({status: "error", error: "Debes completar los campos obligatorios."})

        const userFound = await userService.getUserBy({email})

        if(!userFound) return res.status(401).send({status: "error", error: "Usuario sin credenciales"})

        const isValid = isValidPassword(password, userFound.password)

        if(!isValid) return res.status(401).send({status: "Error", error: "Contraseña incorrecta"})

        const token = generateToken({
            id: userFound._id,
            email,
            role: userFound.role
        })
        console.log("Inicio de sesión exitoso", "Token:" + token);
        res.cookie("TomiCookieToken", token, {
            maxAge: 60*60*1000*24,
            httpOnly: true
        }).redirect('/products')
    } catch (error) {
        console.log(error);
    }
})

sessionsRouter.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, age, password } = req.body

        if(!email || !password) return res.status(401).send({status: "error", error: "Debes completar los campos obligatorios."})
    
        const userExists = await userService.getUserBy({email})
        if(userExists) return res.status(401).send({status:"error", error: "Usuario existente"})

        const userCart = await cartsService.addCart()
    
        const newUser = {
            firstName,
            lastName,
            email,
            age,
            password: createHash(password),
            cartId: userCart._id
        }    
    
        const result = await userService.addUser(newUser)
        
        const token = generateToken({
            id: result._id,
            email,
            firstName
        })
        res.send({status: "success", user: result, token: token})
    } catch (error) {
        console.log(error);
    }
})



// sessionsRouter.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/registerFail'}), async (req, res) => {
//     res.send({status: 'success', message: 'Usuario registrado exitosamente'})
// })

// sessionsRouter.get('/registerFail', (req, res) => {
//     console.log('Falló la estrategia de registro')
//     res.send({error: 'Falló la estrategia de registro'})
// })

// sessionsRouter.post('/login', passport.authenticate('login', {failureRedirect: '/loginFail'}),async (req, res) => {
//     if(!req.user) return res.status(400).send({status: 'error', error: 'credenciales invalidas'})
//     req.session.user = {
//         email: req.user.email,
//         admin: req.user.role === 'admin',
//         firstName: req.user.firstName,
//         lastName: req.user.lastName,
//     }

//     console.log(req.session.user)
//     res.redirect('/products')
// })

// sessionsRouter.get('/loginFail', (req, res) => {
//     console.log('Falló la estrategia de login')
//     res.send({error: 'Falló la estrategia de login'})
// })

sessionsRouter.get('/logout', (req, res) => {
    res.clearCookie('TomiCookieToken').redirect('/login');
});

sessionsRouter.get('/github', passport.authenticate('github', {scope: 'user: email'}), async (req, res) => {})

sessionsRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: 'localhost:8080/login'}), (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})


sessionsRouter.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    try {
        // Si la autenticación es exitosa, req.user contendrá la información del usuario
        res.send({ status: "success", user: req.user });
    } catch (error) {
        res.status(401).send({ status: "error", message: "No está autenticado" });
    }
});