import express, { type Request, type Response } from "express";
import { signup, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/signup", signup)

router.get("/login", login)

router.get("/logout", (req: Request, res: Response) => {
    res.send("Logout Endpoint");
})

export default router;