import BaseController from "./baseController";
import Comment,{IComment} from "../models/commentModel"
import { Request, Response } from "express";

class commentController extends BaseController<IComment>{
    constructor(){
        super(Comment)
    }
    async edit(req: Request, res: Response) {
        req.body.edited=true
        super.edit(req,res)
        
    }
}







export default new commentController()