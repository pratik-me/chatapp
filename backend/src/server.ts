import express from "express";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { fileURLToPath } from 'url';
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import { ENV } from "./lib/env.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = ENV.PORT || 3000;

app.set("trust proxy", 1);     // for load balancers
app.use(express.json({limit: "15mb"}));
app.use(cors({
    origin: ENV.FORNTEND_URI,
    credentials: true,
}))
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Production related
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
    connectDB();
});