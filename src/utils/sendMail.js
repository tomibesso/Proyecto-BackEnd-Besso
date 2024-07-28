import nodemailer from 'nodemailer';
import { objectConfig } from '../config/index.js';

const { gmailPass, gmailPort, gmailService, gmailUser } = objectConfig

const transport = nodemailer.createTransport({
    service: gmailService,
    port: gmailPort,
    auth: {
        user: gmailUser,
        pass: gmailPass
    }
})

export const sendEmail = async ({subject, html, attachments, to}) => {
    return await transport.sendMail({
        from: 'Tomas Besso <Proyecto BackEnd>',
        to,
        subject,
        html,
        attachments
    })
}