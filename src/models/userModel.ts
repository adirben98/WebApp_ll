import mongoose from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  username:string;
  password: string;
  image:string;
  favorites: string[];
  tokens: string[];
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username:{
    type:String,
    required:true
  },
  image:{
    type:String,
    required:false
  },
  password: {
    type: String,
    required: true,
  },
  favorites: {
    type: [String],
  },

  tokens: {
    type: [String],
  },
});

export default mongoose.model<IUser>("User", UserSchema);