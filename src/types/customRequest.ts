import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: string; // Make it optional to prevent TypeScript errors when not set
}
