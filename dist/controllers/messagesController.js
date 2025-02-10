"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getMessages = exports.sendMessage = void 0;
const client_1 = require("@prisma/client");
const jwt = __importStar(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const decodeToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.id;
    }
    catch (error) {
        throw new Error("Invalid token");
    }
};
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { content, recipientId } = req.body;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        res.status(401).json({ error: "Authentication required" });
        return;
    }
    try {
        const senderId = decodeToken(token); // Decode token and extract userId
        const message = yield prisma.message.create({
            data: {
                content,
                senderId,
                recipientId: Number(recipientId), // Ensure recipientId is a number
            },
        });
        res.status(201).json(message);
    }
    catch (error) {
        console.error("error sending message", error);
        res.status(500).json({ error: "Error sending message" });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const recipientId = Number(req.query.recipientId); // Convert to number
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        res.status(401).json({ error: "Authentication required" });
        return;
    }
    if (isNaN(recipientId)) {
        res.status(400).json({ error: "Invalid recipientId" });
        return;
    }
    try {
        const senderId = decodeToken(token); // Decode token and extract userId
        const messages = yield prisma.message.findMany({
            where: {
                OR: [
                    { senderId, recipientId },
                    { senderId: recipientId, recipientId: senderId },
                ],
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching messages" });
    }
});
exports.getMessages = getMessages;
