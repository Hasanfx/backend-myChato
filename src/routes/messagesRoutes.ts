import express from "express";
import { sendMessage, getMessages } from "../controllers/messagesController"; // import your controller methods
import { verifyToken } from "../middlewares/authMiddleware"; // Protect routes with JWT authentication

const router = express.Router();

// Send message
router.post("/", verifyToken, sendMessage);

// Get messages between two users
router.get("/", verifyToken, getMessages);

export default router;
