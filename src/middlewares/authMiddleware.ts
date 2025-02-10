import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../server";

// Extend Request type to include userId
interface AuthRequest extends Request {
  userId?: string;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    
    console.log("Authorization Header:", authHeader);
  
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized: Invalid format" });
        return;
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
        console.log("JWT_SECRET:", JWT_SECRET);
        console.log("Token:", token);
  
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        console.log(decoded.userId);
        
        req.userId = decoded.userId; // Now TypeScript should recognize it
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({ error: "Invalid token" });
    }
};
