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
    likedBy: string[];
}
const RecepieSchema = new mongoose.Schema<IRecepie>({
   
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
    likedBy:
    {
        type: [String],
        default: []
    }
    
});

export default mongoose.model<IRecepie>("Recepie", RecepieSchema);
