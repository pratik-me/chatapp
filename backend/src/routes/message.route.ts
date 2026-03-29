import express, { type Request, type Response } from "express";

const router = express.Router();

router.get("/sent", (req: Request, res: Response) => {
    res.send("Message send endpoint")
})

export default router;