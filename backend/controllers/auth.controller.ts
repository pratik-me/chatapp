import type { Request, Response } from "express"

export const signup = (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields are required"});
        if(password.length < 6) 
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        // Email verification
        const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!emailRegex.test(email)) return res.status(400).json({message: "Invalid email format"})
    } catch (error) {

    }
}

export const login = (req: Request, res: Response) => {
    res.send("Login Endpoint")
}

export const logout = (req: Request, res: Response) => {
    res.send("Logout Endpoint")
}
