import express, { type Response } from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: "Too many login attempts, please try again after 15 minutes",
    standardHeaders: "draft-8",
    legacyHeaders: false,
})

router.use(limiter);

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)   // POST to prevent unauthorized state changes and protect against CSRF attacks.

router.put("/update-profile", isAuthenticated, updateProfile);
router.get("/check", isAuthenticated, (req: any, res: Response) => res.status(200).json(req.user))
router.put("/update-profile", isAuthenticated, updateProfile);
router.get("/check", isAuthenticated, (req: any, res: Response) => res.status(200).json(req.user))

export default router;