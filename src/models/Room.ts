import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true, required: true },
  user1: { type: String, required: true },
  user2: { type: String, required: true },
});

const Room = mongoose.model('Room', RoomSchema);
export default Room;
