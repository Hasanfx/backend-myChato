"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
var jwt = require("jsonwebtoken");
var server_1 = require("../server");
var verifyToken = function (req, res, next) {
    var authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
        res.status(401).json({ error: "Unauthorized: Invalid format" });
        return;
    }
    var token = authHeader.split(" ")[1];
    try {
        console.log("JWT_SECRET:", server_1.JWT_SECRET);
        console.log("Token:", token);
        var decoded = jwt.verify(token, server_1.JWT_SECRET);
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
