import Room from '../models/Room';
import Message from '../models/messageModel';
import { Request, Response } from 'express';
import { AuthRequest } from './authController';
import User from '../models/userModel';

// Check if the room exists
export const checkRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const room = await Room.findOne({ roomId });
  res.send({ exists: !!room });
};

// Create a new room
export const createRoom = async (req: Request, res: Response) => {
  const { roomId, users } = req.body;
  const [user1, user2] = users;
  const room = new Room({ roomId, user1, user2 });
  await room.save();
  res.status(201).send(room);
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
  const messageId = await newMessage.save();
  const room= await Room.findOne({ roomId });
  room.messagesArray.push(messageId._id.toString());
  await room.save();
};

export const getMyRooms = async (req: AuthRequest, res: Response) => {
  const id = req.user._id
  try{
    const user = await User.findOne({_id:id})
    const rooms = await Room.find({ $or: [{ user1: user.username }, { user2: user.username }] });
    let arr=[]
    for(let i=0;i<rooms.length;i++){
      if(rooms[i].user1==user.username){
        arr.push({otherUser:rooms[i].user2,roomId:rooms[i].roomId})}
        else{
          arr.push({otherUser:rooms[i].user1,roomId:rooms[i].roomId})
        
        }
    }
    res.status(200).send(arr)
  }catch(err){
    res.status(400).send(err.message)
  }

  
}
