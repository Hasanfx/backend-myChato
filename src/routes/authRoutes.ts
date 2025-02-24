import express from "express";
import { login, signup, logout } from "../controllers/authController"; // import your controller methods

const router = express.Router();

// User signup
router.post("/signup", signup);

// User login
router.post("/login", login);

// User logout
router.post("/logout", logout);

export default router;
