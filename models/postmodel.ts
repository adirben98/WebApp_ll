import mongoose from "mongoose";

export interface IPost {
  _id: string;
  title: string;
  content: string;
}

const PostSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IPost>("Post", PostSchema);