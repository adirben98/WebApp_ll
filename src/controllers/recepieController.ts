import BaseController from "./baseController";
import Recpie,{IRecepie} from "../models/recepieModel"
import { Response } from "express";
import { AuthRequest } from "./authController";
import User from "../models/userModel";

class recepieController extends BaseController<IRecepie>{
    constructor(){
        super(Recpie)
    }

    // async post(req:AuthRequest, res:Response) {
    //     try {

    //     super.post(req,res)
    //     }catch (err) {
    //         res.status(501).send(err.message);
    //     }
        
    // }
}

export default new recepieController()