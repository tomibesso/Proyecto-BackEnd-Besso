import passport from "passport";
import local from "passport-local";
import userManager from "../dao/Mongo/UserDAOMongo.js";
import GithubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import { objectConfig } from "./index.js";
import { devLogger, prodLogger } from "../utils/loggers.js";

const logger = process.env.LOGGER === 'production' ? prodLogger : devLogger

// passport-local
const LocalStrategy = local.Strategy
// passport-jwt
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const { privateKey, port } = objectConfig

// instanciamos el userDAOMongo
const userService = new userManager()

export const initializePassport = () => {

    // // Estrategia de passport para registrarse
    // passport.use('register', new LocalStrategy({
    //     passReqToCallback: true,
    //     usernameField: 'email'
    // }, async (req, username, password, done) => {
    //     const { firstName, lastName, age } = req.body;

    //     if (!username || !password || !firstName || !lastName || !age) {
    //         return done(null, false, { message: "Debes completar todos los campos" });
    //     }

    //     try {
    //         const userFound = await userService.getUserBy({ email: username });

    //         if (userFound) {
    //             logger.info("Usuario existente");
    //             return done(null, false, { message: "Usuario existente" });
    //         }

    //         const newUser = {
    //             firstName,
    //             lastName,
    //             email: username,
    //             password: createHash(password),
    //             age
    //         };

    //         let result = await userService.addUser(newUser);
    //         return done(null, result, { message: "Usuario registrado exitosamente" });

    //     } catch (error) {
    //         return done(error);
    //     }
    // }));
    
    // // // Estrategia de passport para loguearse
    // passport.use('login', new LocalStrategy({
    //     usernameField: 'email'
    // }, async (username, password, done) => {
    //     try {
    //         const userFound = await userService.getUserBy({ email: username })
    //         if(!userFound) {
    //             logger.info("Usuario No encontrado");
    //             return done(null, false)
    //         }

    //         if(!isValidPassword(password, userFound.password));
    //         return done(null, userFound)
    //     } catch (error) {
    //         return done(error)
    //     }
    // }))

    // // Estrategia de passport para loguearse con GitHub
    passport.use('github', new GithubStrategy({
        clientID:'Iv23li7fDaNQWGweOXvy',
        clientSecret:'38837c7acdeee010fdf145e32648481f991b23ae',
        callbackURL: `http://localhost:${port}/api/sessions/githubcallback`
    },async (accessToken, refreshToken, profile, done) => {
        try {
            logger.info(profile);
            let user = await userService.getUserBy({email: profile._json.email})
            if(!user) {
                const newUser = {
                    firstName: profile._json.name,
                    email: profile._json.email,
                    password: ''
                }

                const result = await userService.addUser(newUser);
                done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    // estrategia de jwt
    const cookieExtractor = req => {
        let token = null
        if(req && req.cookies){
            token = req.cookies['TomiCookieToken']
        }
        return token
    };

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: privateKey
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('current', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: privateKey
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done)=>{
        try {
            let user = await userService.getUserBy({_id: id})
            done(null, user)
        } catch (error) {
            done(error)
        }
    })
}