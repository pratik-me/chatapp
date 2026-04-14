import type { ExtendedError, Socket } from "socket.io"
import jwt from "jsonwebtoken"
import { ENV } from "../lib/env.js";
import prisma from "@prisma";


export const socketAuthMiddleware = async (socket: Socket, next: (err?: ExtendedError) => void) => {
    try {
        const token = socket.handshake.headers.cookie?.split("; ").find((row: string) => row.startsWith("jwt="))?.split("=")[1];
        if (!token) {
            console.log("Socket connection rejected. No token provided!");
            return next(new Error("Unauthorized - No Token Provided"));
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET!) as { userId: string };
        if (!decoded) {
            console.log("Socket connect rejected: Invalid Token");
            return next(new Error("Unauthorized - Invalid Token"));
        }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
            omit: {
                password: true,
            }
        });
        if (!user) {
            console.log("Socket connection rejected: User Not Found");
            return next(new Error("User not found"));
        }

        socket.user = user;
        socket.userId = user.id;

        console.log(`Socket authenticated for user: ${user.fullName} (${user.id})`);
        next();
    } catch (error) {
        console.log("Error in socket authentication", error);
        next(new Error("Unauthorized - Authentication failed"))
    }
}