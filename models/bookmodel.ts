import mongoose from "mongoose";

export interface IBook {
  _id: number;
  name: string;
  genre: string;
  PEGI: number;
}

const BookSchema = new mongoose.Schema<IBook>({
  _id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: false,
  },
  PEGI: {
    type: Number,
    required: false,
  }
});

export default mongoose.model<IBook>("book", BookSchema);