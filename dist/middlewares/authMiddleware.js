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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const server_1 = require("../server");
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
        res.status(401).json({ error: "Unauthorized: Invalid format" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        console.log("JWT_SECRET:", server_1.JWT_SECRET);
        console.log("Token:", token);
        const decoded = jwt.verify(token, server_1.JWT_SECRET);
        console.log(decoded.userId);
        req.userId = decoded.userId; // Now TypeScript should recognize it
        next();
    }
    catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
