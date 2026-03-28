import express, { type Request, type Response } from "express";

const router = express.Router();

router.get("/signup", (req: Request, res: Response) => {
    res.send("Signup Endpoint");
})

router.get("/login", (req: Request, res: Response) => {
    res.send("Login Endpoint");
})

router.get("/logout", (req: Request, res: Response) => {
    res.send("Logout Endpoint");
})

export default router;