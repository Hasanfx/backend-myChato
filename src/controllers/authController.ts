import { Request, Response } from "express";
import bcrypt, { hashSync, compareSync } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../server";

import * as cooke from "cookie-parser"

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {

  console.log("Received Data:", req.body);
  const { email, password } = req.body;


  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid User" });
      return;
    }


    if (!compareSync(password, user.password)) {
      res.status(401).json({ message: "Invalid Password" });
      return;
    }
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET);

        // Set the token in an HTTP-only cookie
      res.cookie("token", token, {
          httpOnly: true,
          secure:true, // Use HTTPS in production
          sameSite: "strict",
          maxAge: 60 * 60 * 1000 // 1 hour
      });

    res.json({ user, token });


  } catch (error:any) {
    res.status(500).json({ message: "Server error" });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  console.log("Received Data:", req.body);

  try {
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashSync(password, 10)
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const logout = (req: Request, res: Response) => {
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