"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const messagesRoutes_1 = __importDefault(require("./routes/messagesRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL, // Allow frontend origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express_1.default.json()); // To parse JSON bodies
// Routes
app.use('/api/messages', messagesRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
