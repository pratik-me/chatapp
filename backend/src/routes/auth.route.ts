import express, { type Request, type Response } from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout);  // POST to prevent unauthorized state changes and protect against CSRF attacks.

router.put("/update-profile", isAuthenticated, updateProfile);
router.get("/check", isAuthenticated, (req: any, res: Response) => res.status(200).json(req.user))

export default router;