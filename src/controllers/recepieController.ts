import BaseController from "./baseController";
import Recepie,{IRecepie} from "../models/recepieModel"
import { Response } from "express";
import { AuthRequest } from "./authController";

class recepieController extends BaseController<IRecepie>{
    constructor(){
        super(Recepie)
    }
    async getTopFive(req: AuthRequest, res: Response){
        try {
            const recepies = await Recepie.find().sort({likes:-1}).limit(5)
            res.status(200).send(recepies)
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
    async likeIncrement(req: AuthRequest, res: Response){
        try {
            const recipeId = req.params.id;
            const userId = req.user._id;

            const recepie = await Recepie.findById(recipeId)
            if (recepie.likedBy.includes(userId)){
                res.status(400).send("You have already liked this recepie")
            }
            else{
                recepie.likes+=1
                recepie.likedBy.push(userId)
                await recepie.save()
                res.status(200).send(recepie)
            }
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
    async likeDincrement(req: AuthRequest, res: Response){
        try {
            const recipeId = req.params.id;
            const userId = req.user._id;

            const recepie = await Recepie.findById(recipeId)
            if (recepie.likedBy.includes(userId)){
                recepie.likes-=1
                recepie.likedBy.filter((id)=>id!==userId)
                await recepie.save()
                res.status(200).send(recepie)
            }
            else{
                res.status(400).send("You didn't like this recepie")
            }
        } catch (error) {
            res.status(400).send(error.message)
        }
    }

}

export default new recepieController()