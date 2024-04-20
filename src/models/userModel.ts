import mongoose from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  full_name:string;
  password: string;
  tokens: string[];
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  full_name:{
    type:String,
    required:true
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