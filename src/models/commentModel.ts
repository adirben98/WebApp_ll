import mongoose from "mongoose";
import moment from "moment";
export interface IComment {
    _id: string;
    author: string;
    content: string;
    recipeId: string;
    createdAt: string;
    edited: boolean;
}

const commentSchema=new mongoose.Schema<IComment>({
   
    author:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    recipeId:{
        type:String,
        required:true
    },
    createdAt:{
        type:String,
        default:moment().format('MMMM Do YYYY, h:mm:ss a')
    },
    edited:{
        type:Boolean,
        default:false
    }
    
})

export default mongoose.model<IComment>("Comment",commentSchema);
    