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
exports.logout = exports.signup = exports.login = void 0;
const bcryptjs_1 = require("bcryptjs");
const client_1 = require("@prisma/client");
const jwt = __importStar(require("jsonwebtoken"));
const server_1 = require("../server");
const prisma = new client_1.PrismaClient();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received Data:", req.body);
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findFirst({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Invalid User" });
            return;
        }
        if (!(0, bcryptjs_1.compareSync)(password, user.password)) {
            res.status(401).json({ message: "Invalid Password" });
            return;
        }
        const token = jwt.sign({ id: user.id }, server_1.JWT_SECRET);
        // Set the token in an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // Use HTTPS in production
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        });
        res.json({ user, token });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    console.log("Received Data:", req.body);
    try {
        const existingUser = yield prisma.user.findFirst({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }
        const user = yield prisma.user.create({
            data: {
                email,
                name,
                password: (0, bcryptjs_1.hashSync)(password, 10)
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});
exports.signup = signup;
const logout = (req, res) => {
    // Clear the HTTP-only 'token' cookie
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "strict" // Prevent CSRF attacks
    });
    // Send confirmation response
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};
exports.logout = logout;
