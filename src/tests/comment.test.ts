import request from "supertest";
import init from "../app";
import mongoose from "mongoose";
import { App } from "supertest/types";
import Comment from "../models/commentModel";

type TestComment = {
    author: string;
    content: string;
    post: string;
    createdAt: Date;
    editAt?:Date
}
// const comment: TestComment = {
//     author: "idan",
//     content:"Thats a Bad recepie bro",
    

// }

