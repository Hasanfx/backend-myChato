import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true }, // Only return ID and name
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Get a single user by ID
export const getUserById = async (req: Request, res: Response) => {
  const userId = Number(req.params.id); // Convert ID from string to number

  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return 
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return 
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};
