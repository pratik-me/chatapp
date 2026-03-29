import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { ENV } from "../lib/env.js";
import prisma from "../../prisma/index.js";

export const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;
        if(!token) 
            return res.status(401).json({message: "Unauthorized Access: No token provided"});

        const decoded = jwt.verify(token, ENV.JWT_SECRET!) as {userId: string};
        if(!decoded) 
            return res.status(401).json({message: "Unauthorized Access: Invalid token"});

        const user = await prisma.user.findUnique({
            where: {id: decoded.userId},
        });
        if(!user) return res.status(404).json({message: "User not found"});

        req.user = user;
        
        next();
    } catch (error) {
        console.log("Error in isAuthenticated middleware.\n", error);
        res.status(401).json({message: "Internal Server error"});
    }
}