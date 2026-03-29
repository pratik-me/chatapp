import nodemailer from "nodemailer";
import "dotenv/config";
import { createWelcomeEmailTemplate } from "./emailTemplate.js";
import { ENV } from "../env.js";


const transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: Number(ENV.SMTP_PORT) || 587,
    service: ENV.SMTP_SERVICE,
    auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
    }
})


export const sendEmail = async(to: string, subject: string, templateName: string) => {
    try {
        await transporter.verify();

        await transporter.sendMail({
            from: `${ENV.SMTP_USER}`,
            to,
            subject,
            html: createWelcomeEmailTemplate(templateName, ENV.FORNTEND_URI!),
        });
        return true;
    } catch (error) {
        console.log("Error while sending email:\n", error);
        return false;
    }
}