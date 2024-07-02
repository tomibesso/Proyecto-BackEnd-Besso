import { Router } from "express";
import { sendSMS } from "../../utils/sendSMS.js";
import { sendEmail } from "../../utils/sendMail.js";

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

export default router