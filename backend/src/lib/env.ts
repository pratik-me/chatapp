import "dotenv/config";

export const ENV = {
    PORT: process.env.PORT,
    FORNTEND_URI: process.env.FORNTEND_URI,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SERVICE: process.env.SMTP_SERVICE,
    SMTP_HOST: process.env.SMTP_HOST,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
    CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
}