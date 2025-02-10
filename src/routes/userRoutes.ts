import express from "express";
import { getUsers, getUserById } from "../controllers/userController";

const router = express.Router();

router.get("/", getUsers); // GET all users
router.get("/:id", getUserById); // GET single user

export default router;
