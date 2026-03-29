import express, { type Request, type Response } from "express";
import { getAllContacts, getMessagesById } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/contacts", isAuthenticated, getAllContacts);
// router.get("/chats", getChatPartners);
router.get("/:id", isAuthenticated, getMessagesById);
// router.post("/send/:id", sendMessage);

router.get("/sent", (req: Request, res: Response) => {
    res.send("Message send endpoint")
})

export default router;