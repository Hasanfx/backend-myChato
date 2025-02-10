"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            select: { id: true, name: true }, // Only return ID and name
        });
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
});
exports.getUsers = getUsers;
// Get a single user by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id); // Convert ID from string to number
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching user" });
    }
});
exports.getUserById = getUserById;
