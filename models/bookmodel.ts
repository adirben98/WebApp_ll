import mongoose from "mongoose";

export interface IBook {
  _id: number;
  name: string;
  genre: string;
  author: string;
}

const BookSchema = new mongoose.Schema<IBook>({

  name: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: true,
  }
});

export default mongoose.model<IBook>("book", BookSchema);