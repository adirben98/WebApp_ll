import mongoose from "mongoose";

export interface IUser {
  _id: string;
  username: string;
  password: string;
  tokens: string[];
}

const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: {
    type: [String],
  },
});

export default mongoose.model<IUser>("User", UserSchema);