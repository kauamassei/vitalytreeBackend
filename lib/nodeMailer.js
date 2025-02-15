import nodemailer from 'nodemailer';
import dotenv from "dotenv"

dotenv.config()
// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Substitua pelo seu servidor SMTP
    port: process.env.EMAIL_PORT, // Porta padrão para envio de e-mails
    secure: false, // true para 465, false para outras portas
    auth: {
        user: process.env.EMAIL_AUTH,
        pass: process.env.EMAIL_PASS,
    },
});

export {
     transporter
};
