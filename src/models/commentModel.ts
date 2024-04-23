import mongoose from "mongoose";

export interface IComment {
    _id: string;
    author: string;
    content: string;
    recepieId: string;
    createdAt: Date;
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
    recepieId:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    edited:{
        type:Boolean,
        default:false
    }
    
})

export default mongoose.model<IComment>("Comment",commentSchema);
    