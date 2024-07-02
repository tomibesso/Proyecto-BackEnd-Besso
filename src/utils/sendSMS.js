import twilio from "twilio";
import { objectConfig } from "../config/index.js";

const { twilioSid, twilioAuthToken, twilioPhone } = objectConfig

const client = twilio(twilioSid, twilioAuthToken)

export const sendSMS = async () => {
    return await client.messages.create({
        body: 'Este es un SMS de prueba',
        from: twilioPhone,
        to: '+541168393074'
    })
}