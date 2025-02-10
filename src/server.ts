import express from 'express';
import cors from 'cors';
import messagesRoutes from './routes/messagesRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from "./routes/userRoutes";

import dotenv from 'dotenv';
dotenv.config();


export const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow frontend origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);app.use(express.json());  // To parse JSON bodies

// Routes
app.use('/api/messages', messagesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
