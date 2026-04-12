import type { Response } from "express";
import prisma from "@prisma";

export const getAllContacts = async (req: any, res: Response) => {
    try {
        const loggedInUserId = req.user.id;
        const allContacts = await prisma.user.findMany({
            where: { id: { not: loggedInUserId } },
            select: {
                id: true,
                fullName: true,
                email: true,
            }
        });

        res.status(200).json(allContacts);
    } catch (error) {
        console.log("Error in getAllContacts:\n", error);
        res.status(500).json({ message: "Internal Server error" });
    }
};

export const getMessagesById = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const { id: partnerId } = req.params;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: partnerId },
                    { senderId: partnerId, receiverId: userId },
                ],
            }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessagesById:\n", error);
        res.status(500).json({ message: "Internal Server error" });
    }
}

export const sendMessage = async (req: any, res: Response) => {
    try {
        const userId: string = req.user.id;
        const {id : partnerId} = req.params;
        const { text, image }: { text: string, image: string } = req.body;

        const partnerExists = await prisma.user.findUnique({ where: { id: partnerId } });
        if (!partnerExists) return res.status(400).json({ message: "Receiver not found" });

        if (userId === partnerId) return res.status(400).json({ message: "Cannot send message to yourself" })
        if (!image && !text.trim()) return res.status(400).json({ message: "Empty message found" })
        else if (!image) {
            const message = await prisma.message.create({
                data: {
                    senderId: userId,
                    receiverId: partnerId,
                    text: text.trim(),
                    image: "",
                }
            });

            return res.status(201).json(message);
        }

        const message = await prisma.message.create({
            data: {
                senderId: userId,
                receiverId: partnerId,
                text: text.trim().length === 0 ? "" : text,
                image
            }
        });

        return res.status(201).json(message);
    } catch (error) {
        console.log("Error in sendMessage:\n", error);
        res.status(500).json({ message: "Internal Server error" });
    }
}

export const getChatPartners = async (req: any, res: Response) => {
    try {
        const loggedInUserId: string = req.user.id;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { receiverId: loggedInUserId },
                    { senderId: loggedInUserId },
                ],
            },
        });

        const allPartnersId = messages.map(message => message.senderId === loggedInUserId ? message.receiverId : message.senderId);
        const partnersId = [... new Set(allPartnersId)];

        const partners = await prisma.user.findMany({
            where: { id: { in: partnersId } },
            select: {
                id: true,
                fullName: true,
                email: true,
            },
        });

        res.status(200).json(partners);
    } catch (error) {
        console.log("Error in getChatPartners:\n", error);
        res.status(500).json({ message: "Internal Server error" });
    }
}