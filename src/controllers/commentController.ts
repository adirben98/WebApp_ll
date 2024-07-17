import BaseController from "./baseController";
import Comment,{IComment} from "../models/commentModel"
import {  Response } from "express";
import { AuthRequest } from "./authController";

class commentController extends BaseController<IComment>{
    constructor(){
        super(Comment)
    }
    async edit(req: AuthRequest, res: Response) {
        req.body.edited=true
        super.edit(req,res)
        
    }
}







export default new commentController()