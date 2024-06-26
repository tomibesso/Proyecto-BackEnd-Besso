import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jsonwebtokens.js';

import { UserService } from "../service/index.js"
import { CartService } from "../service/index.js";
import UserDto from '../dtos/usersDTO.js';

class sessionController {
    constructor() {
        this.userService = UserService;
        this.cartsService = CartService;
    }
 
    login = async (req, res) => {
        try {
            const {email, password} = req.body
    
            if(!email || !password) return res.status(401).send({status: "error", error: "Debes completar los campos obligatorios."})
    
            const userFound = await this.userService.getUser({email})
    
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
    }

    register = async (req, res) => {
        try {
            const userDto = new UserDto(req.body);

            console.log(userDto);
    
            if(!userDto.email || !userDto.password) return res.status(401).send({status: "error", error: "Debes completar los campos obligatorios."})
        
            const userExists = await this.userService.getUser({email: userDto.email})
            if(userExists) return res.status(401).send({status:"error", error: "Usuario existente"})
    
            const userCart = await this.cartsService.addCart()
        
            const newUser = {
                firstName: userDto.firstName,
                lastName: userDto.lastName,
                email: userDto.email,
                age: userDto.age,
                password: createHash(userDto.password),
                cartId: userCart._id
            }; 
        
            const result = await this.userService.addUser(newUser)
            
            const token = generateToken({
                id: result._id,
                email: userDto.email,
                firstName: userDto.firstName
            });
            res.send({status: "success", user: result, token: token})
        } catch (error) {
            console.log(error);
        }
    }

    logout = (req, res) => {
        res.clearCookie('TomiCookieToken').redirect('/login');
    }

    githubCallback = (req, res) => {
        req.session.user = req.user
    }

    current = (req, res) => {
        try {
            res.send({ status: "success", user: req.user });
        } catch (error) {
            res.status(401).send({ status: "error", message: "No está autenticado" });
        }
    }
}

export default sessionController;