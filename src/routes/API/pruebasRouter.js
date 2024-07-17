import { Router } from "express";
import { sendSMS } from "../../utils/sendSMS.js";
import { sendEmail } from "../../utils/sendMail.js";
import { generateProducts } from "../../utils/generateProducts.js";
import { faker } from "@faker-js/faker";

const router = Router();

// Pruebas de mailing y mensajeria
router.get('/mail', (req, res) => {
    try {
        sendEmail({
            subject: "Correo de prueba 2",
            html: `<div>
                <h1>Este es un mail de prueba</h1>
            </div>`,
            attachments: [{
                filename: "monumental-wallpaper.jpg",
                path: 'src/public/assets/monumental-wallpaper.jpg'
            }]
        })
        res.send('Email enviado con exito')
    } catch (error) {
        console.error(error);
    }
})

router.get('/sms', (req, res) => {
    try {
        sendSMS()
        res.send('Email enviado con exito')
    } catch (error) {
        console.error(error);
    }
})

router.get('/mockingproducts', (req, res) => {
    try {
        let products = []

        for (let i = 0; i < 100 ; i++) {            
            products.push(generateProducts())
        }
        res.status(200).send({status: 'Success',  payload: products})
    } catch (error) {
        console.error("Error al crear productos:", error);
    }
})

router.get('/log', (req, res) => {
    req.logger.warning('Alerta!')
    res.send('Logs')
})

router.get('/test/user', (req, res) => {
    
    const user = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }

    res.send({status: 'success', payload: user})
})

router.get('/loggerTest', (req, res) => {
    req.logger.debug('Este es un mensaje debug');
    req.logger.http('Este es un mensaje http');
    req.logger.info('Este es un mensaje info');
    req.logger.warning('Este es un mensaje warning');
    req.logger.error('Este es un mensaje error');
    req.logger.fatal('Este es un mensaje fatal');

    res.send('Test de logs generados en consola.')
})



export default router