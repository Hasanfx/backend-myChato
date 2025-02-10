import { Request } from "express";

// Add userId to the request
declare module "express" {
  interface Request {
    userId?: string;
  }
}
