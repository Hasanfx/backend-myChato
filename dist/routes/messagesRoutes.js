"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messagesController_1 = require("../controllers/messagesController"); // import your controller methods
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Protect routes with JWT authentication
const router = express_1.default.Router();
// Send message
router.post("/", authMiddleware_1.verifyToken, messagesController_1.sendMessage);
// Get messages between two users
router.get("/", authMiddleware_1.verifyToken, messagesController_1.getMessages);
exports.default = router;
