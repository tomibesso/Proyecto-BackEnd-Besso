import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { generateToken, verifyToken } from '../utils/jsonwebtokens.js';
import { sendEmail } from '../utils/sendMail.js'

import { UserService } from "../service/index.js"
import { CartService } from "../service/index.js";
import UserDto from '../dtos/usersDTO.js';
import currentUserDto from '../dtos/currentUserDTO.js';

import { objectConfig } from '../config/index.js';

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
            req.logger.info(`Inicio de sesión exitoso. Token: ${token}`);
            res.cookie("TomiCookieToken", token, {
                maxAge: 60*60*1000*24,
                httpOnly: true
            }).redirect('/products')
        } catch (error) {
            req.logger.error(error);
        }
    }

    register = async (req, res) => {
        try {
            const userDto = new UserDto(req.body);

            req.logger.info(userDto);
    
            if(!userDto.email || !userDto.password) return res.status(401).send({status: "error", error: "Debes completar los campos obligatorios."})
        
            const userExists = await this.userService.getUser({email: userDto.email})
            if(userExists) return res.status(401).send({status:"error", error: "Usuario existente"})
    
            const userCart = await this.cartsService.addCart()
            const cartId = userCart._id.toString()
        
            const newUser = {
                firstName: userDto.firstName,
                lastName: userDto.lastName,
                email: userDto.email,
                age: userDto.age,
                password: createHash(userDto.password),
                cartId: cartId
            }; 
        
            const result = await this.userService.addUser(newUser)
            
            const token = generateToken({
                id: result._id,
                email: userDto.email,
                firstName: userDto.firstName
            });
            res.send({status: "success", user: result, token: token})
        } catch (error) {
            req.logger.error(error);
        }
    }

    logout = (req, res) => {
        res.clearCookie('TomiCookieToken').redirect('/login');
    }

    restorePassword = async (req, res) => {
        try {
            const {userMail} = req.body

            const user = await this.userService.getUser({ email: userMail });
            if (!user) {
                return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
            }

            const token = generateToken({
                email: userMail,
                id: user._id
            }, '1h');
            res.cookie("passwordResetToken", token, {
                maxAge: 1000 * 60 * 60,
                httpOnly: true
            });
            const resetUrl = `http://localhost:8080/resetPassword`

            await sendEmail({
                to: userMail,
                subject: "Restablecer contraseña",
                html: `<p>Para restablecer tu contraseña, hace click en el siguiente enlace: </p><a href="${resetUrl}">Restablecer contraseña</a>`
            })

            res.status(200).send({status: "success", message: "Correo enviado con éxito."})
        } catch (error) {
            req.logger.error(error)
            res.status(500).send({status: "Error", error: "Error en el servidor"})
        }
    }

    resetPassword = async (req, res) => {
        try {
            const token = req.cookies.passwordResetToken;
            const { newPassword } = req.body;

            if (!token) {
                return res.status(401).send({ status: "error", error: "Token no encontrado" });
            }

            if (!newPassword) {
                req.logger.error("Nueva contraseña no proporcionada");
                return res.status(400).send({ status: "error", error: "Nueva contraseña no proporcionada" });
            }

            const decodedToken = verifyToken(token, objectConfig.privateKey);
            const user = await this.userService.getUser({ email: decodedToken.user.email });

            if (isValidPassword(newPassword, user.password)) {
                return res.status(400).send({ status: "error", error: "No puedes usar la misma contraseña" });
            }

            await this.userService.updateUser(user._id, { password: createHash(newPassword) });

            res.clearCookie('passwordResetToken');
            res.send({ status: "success", message: "Contraseña actualizada" });
        } catch (error) {
            req.logger.error(error);
            res.status(500).send({ status: "error", error: "Error en el servidor" });
        }
    }

    githubCallback = (req, res) => {
        req.session.user = req.user
    }

    current = (req, res) => {
        try {
          if (!req.user) {
            return res.status(401).send({ status: "error", message: "No está autenticado" });
          }
    
          const user = new currentUserDto(req.user.user); // Crear el DTO del usuario
          res.send({ status: "success", user });
        } catch (error) {
          res.status(500).send({ status: "error", message: error.message });
        }
      }
}

export default sessionController;