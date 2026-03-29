import type { Request, Response } from "express"
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils/cookies.js";
import { sendEmail } from "../lib/email/emailRender.js";

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password)
            return res.status(400).json({ message: "All fields are required" });
        if (password.length < 6)
            return res.status(400).json({ message: "Password must be at least 6 characters long" });

        const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(email))
            return res.status(400).json({ message: "Invalid email format" });  // Email verification

        const user = await User.findOne({ email, });
        if (user)
            return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        generateToken(newUser._id as object, res);

        sendEmail(newUser.email as string, "Welcome to Chatapp", newUser.fullName as string)
            .catch(err => console.error("Email failed to send", err));

        return res.status(201).json({
            _id: newUser._id,
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

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const checkPassword = await bcrypt.compare(password, user.password as string);
        generateToken(user._id as object, res);

        res.status(200).json({ 
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {

    }
}

export const logout = (req: Request, res: Response) => {
    res.send("Logout Endpoint")
}
