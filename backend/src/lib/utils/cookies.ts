import type { Response } from "express";
import jwt from "jsonwebtoken";


export const generateToken = (userId: object, res: Response) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly: true,             // For XSS attacks: cross site scripting
        sameSite: "strict",        // CSRF attacks
        secure: process.env.NODE_ENV === "production" ? true : false,   // enabling https connections
    });

    return token;
}