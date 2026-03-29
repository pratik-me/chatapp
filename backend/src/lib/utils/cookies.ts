import type { Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../env.js";


export const generateToken = (userId: object, res: Response) => {
    const token = jwt.sign({ userId }, ENV.JWT_SECRET!, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly: true,             // For XSS attacks: cross site scripting
        sameSite: "strict",        // CSRF attacks
        secure: ENV.NODE_ENV === "production" ? true : false,   // enabling https connections
    });

    return token;
}