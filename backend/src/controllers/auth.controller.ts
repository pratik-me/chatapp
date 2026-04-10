import type { NextFunction, Request, Response } from "express"
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils/cookies.js";
import { sendEmail } from "../lib/email/emailRender.js";
import cloudinary from "../lib/cloudinary/index.js";
import prisma from "../../prisma/index.js";

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password)
            return res.status(400).json({ message: "All fields are required" });
        if (password.length < 6)
            return res.status(400).json({ message: "Password must be of at least 6 characters" });

        const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(email))
            return res.status(400).json({ message: "Invalid email format" });  // Email verification

        const user = await prisma.user.findUnique({
            where: { email },
        })
        if (user)
            return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
            }
        });

        generateToken(newUser.id, res);

        sendEmail(newUser.email as string, "Welcome to Chatapp", newUser.fullName as string)
            .catch(err => console.error("Email failed to send", err));

        return res.status(201).json({
            id: newUser.id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        console.log("Error in singup controller:\n", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields are required" });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) return res.status(400).json({ message: "Invalid Credentials" });

        generateToken(user.id, res);

        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.error("Error in login controller:\n", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = (req: Request, res: Response) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
}

export const updateProfile = async (req: any, res: Response, next: NextFunction) => {
    try {
        const {profilePic} = req.body;
        if(!profilePic) return res.status(400).json({message: "Profile Picture is required"});
        const userId: string = req.user.id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: {
                profilePic: uploadResponse.secure_url
            }
        })

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile controller:\n", error);
        res.status(500).json({message: "Internal Server error"})
    }
}
