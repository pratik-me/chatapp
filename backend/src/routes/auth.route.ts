import express, { type Request, type Response } from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout);  // POST to prevent unauthorized state changes and protect against CSRF attacks.

// router.put("/update-profile", isAuthenticated, updateProfile);

export default router;