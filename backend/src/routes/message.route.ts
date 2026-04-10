import express, { type Request, type Response } from "express";
import { getAllContacts, getChatPartners, getMessagesById, sendMessage } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/messages/:id", getMessagesById);
router.post("/send/:id", sendMessage);


export default router;