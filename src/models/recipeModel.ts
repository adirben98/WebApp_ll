import mongoose from "mongoose";


export interface IRecipe {
    _id?: string;
    name: string;
    author: string;
    authorImg:string;
    category: string;
    description: string;
    ingredients: string[];
    instructions: string;
    createdAt:Date
    image: string;
    likes: number;
    likedBy: string[];
}
const RecipeSchema = new mongoose.Schema<IRecipe>({
   
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
    description: {
        type: String,
        required: true,
    },
    authorImg:{
        type:String,
        required:false
    },
    ingredients: {
        type: [String],
        required: true,
    },
    instructions: {
        type: String,
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

export default mongoose.model<IRecipe>("Recipe", RecipeSchema);
