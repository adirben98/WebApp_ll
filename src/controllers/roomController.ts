import Room from '../models/Room';
import Message from '../models/messageModel';
import { Request, Response } from 'express';

// Check if the room exists
export const checkRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const room = await Room.findOne({ roomId });
  res.json({ exists: !!room });
};

// Create a new room
export const createRoom = async (req: Request, res: Response) => {
  const { roomId, user1, user2 } = req.body;
  const room = new Room({ roomId, user1, user2 });
  await room.save();
  res.status(201).json(room);
};

// Retrieve messages for a room
export const getMessages = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
  res.json(messages);
};

// Save a new message
export const saveMessage = async (data: { roomId: string, username: string, message: string }) => {
  const { roomId, username, message } = data;
  const newMessage = new Message({ roomId, username, message });
  await newMessage.save();
};
