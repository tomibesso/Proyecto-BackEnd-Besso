import {Router} from 'express';
import userManager from '../dao/UserManagerMongo.js';

export const sessionsRouter = Router()
const userService = new userManager()

sessionsRouter.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body

        if(!email || !password) return res.status(401).send({status: "error", error: "Debes completar los campos obligatorios."})

        const userFound = await userService.getUserBy({email, password})

        if(!userFound) return res.status(401).send({status: "error", error: "Usuario sin credenciales"})

        req.session.user = {
            email,
            admin: userFound.role === 'admin'
        }

        console.log(req.session.user)
        res.send('login success')
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
    
        const newUser = {
            firstName,
            lastName,
            email,
            age,
            password
        }    
    
        const result = await userService.addUser(newUser)
        res.send("Usuario creado con èxito", result)
    } catch (error) {
        console.log(error);
    }
})

sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy( err => {
        if(err) return res.send({status: 'error', error: err})
        else return res.send('logout')
    })
})