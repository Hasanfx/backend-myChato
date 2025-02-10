import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const decodeToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    return decoded.id;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const { content, recipientId } = req.body;
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return
  }

  try {
    const senderId = decodeToken(token); // Decode token and extract userId

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        recipientId: Number(recipientId), // Ensure recipientId is a number
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("error sending message",error);
    res.status(500).json({ error: "Error sending message" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const recipientId = Number(req.query.recipientId); // Convert to number
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return
  }

  if (isNaN(recipientId)) {
    res.status(400).json({ error: "Invalid recipientId" });
    return 
  }

  try {
    const senderId = decodeToken(token); // Decode token and extract userId

    const messages = await prisma.message.findMany({
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
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};
