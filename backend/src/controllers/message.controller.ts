import type { Response } from "express";
import prisma from "../../prisma/index.js";

export const getAllContacts = async (req: any, res: Response) => {
    try {
        const loggedInUserId = req.user.id;
        const allContacts = await prisma.user.findMany({
            where: { id: { not: loggedInUserId } },
            select: {
                password: true,
            }
        });

        res.status(200).json(allContacts);
    } catch (error) {
        console.log("Error in getAllContacts:\n", error);
        res.status(500).json({message: "Internal Server error"});
    }
};

export const getMessagesById = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const partnerId = req.params;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {senderId: userId, receiverId: partnerId},
                    {senderId: partnerId, receiverId: userId},
                ],
            }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessagesById:\n", error);
        res.status(500).json({message: "Internal Server error"});
    }
}