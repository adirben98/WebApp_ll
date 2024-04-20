import mongoose from "mongoose";

export interface IComment {
    _id: string;
    author: string;
    content: string;
    post: string;
    createdAt: Date;
    editAt?:Date
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
    post:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    },
    editAt:{
        type:Date
    }
})

export default mongoose.model<IComment>("Comment",commentSchema);
    