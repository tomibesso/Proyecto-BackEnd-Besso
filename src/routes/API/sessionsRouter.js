import {Router} from 'express';
import passport from 'passport';
import sessionController from '../../controllers/sessionsController.js';

const router = Router()
const { login, register, logout, githubCallback, current } = new sessionController()

router.post('/login', login)

router.post('/register', register)

router.post('/logout', logout);

router.get('/github', passport.authenticate('github', {scope: 'user: email'}), async (req, res) => {})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: 'localhost:8080/login'}), githubCallback)

router.get('/current', passport.authenticate('current', { session: false }), current);


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

export default router; 