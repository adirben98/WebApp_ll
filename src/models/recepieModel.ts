import mongoose from "mongoose";


export interface IRecepie {
    _id: string;
    name: string;
    author: string;
    category: string;
    ingredients: string[];
    instructions: string[];
    createdAt:Date
    image: string;
    likes: number;
}
const RecepieSchema = new mongoose.Schema<IRecepie>({
    _id: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    ingredients: {
        type: [String],
        required: true,
    },
    instructions: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    image:{
        type: String,
        required: true,
    },
    likes:
    {
        type: Number,
        default: 0
    },
    
});

export default mongoose.model<IRecepie>("Recepie", RecepieSchema);
