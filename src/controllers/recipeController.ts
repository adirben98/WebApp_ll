import BaseController from "./baseController";
import Recipe,{IRecipe} from "../models/recipeModel"
import { Response } from "express";
import { AuthRequest } from "./authController";

class recipeController extends BaseController<IRecipe>{
    constructor(){
        super(Recipe)
    }
    async getTopFive(req: AuthRequest, res: Response){
        try {
            const recipes = await Recipe.find().sort({likes:-1}).limit(5)
            res.status(200).send(recipes)
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
    async likeIncrement(req: AuthRequest, res: Response){
        try {
            const recipeId = req.params.id;
            const userId = req.user._id;

            const recipe = await Recipe.findById(recipeId)
            if (recipe.likedBy.includes(userId)){
                res.status(400).send("You have already liked this recipe")
            }
            else{
                recipe.likes+=1
                recipe.likedBy.push(userId)
                await recipe.save()
                res.status(200).send(recipe)
            }
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
    async likeDincrement(req: AuthRequest, res: Response){
        try {
            const recipeId = req.params.id;
            const userId = req.user._id;

            const recipe
             = await Recipe.findById(recipeId)
            if (recipe
                .likedBy.includes(userId)){
                recipe
                .likes-=1
                recipe
                .likedBy.filter((id)=>id!==userId)
                await recipe
                .save()
                res.status(200).send(recipe)
            }
            else{
                res.status(400).send("You haven't like this recipe yet")
            }
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
    

}

export default new recipeController()