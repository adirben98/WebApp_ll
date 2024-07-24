import BaseController from "./baseController";
import Recipe, { IRecipe } from "../models/recipeModel";
import { Response } from "express";
import { AuthRequest } from "./authController";
import axios from "axios";
import User from "../models/userModel";

class recipeController extends BaseController<IRecipe> {
  constructor() {
    super(Recipe);
  }
async getAll(req: AuthRequest, res: Response) {
    try {
      const recipes = await Recipe.find();
      res.status(200).send(recipes);
    } catch (error) {
      res.status(400).send(error.message);
    }
}

  
  async getTopFive(req: AuthRequest, res: Response) {
    try {
      const recipes = await Recipe.find().sort({ likes: -1 }).limit(5);
      res.status(200).send(recipes);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
  async isLiked(req: AuthRequest, res: Response) {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (recipe.likedBy.includes(req.user._id)) {
        return res.status(200).send(true);
      }
      return res.status(200).send(false);
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }

  async likeIncrement(req: AuthRequest, res: Response) {
    try {
      const recipeId = req.params.id;
      const userId = req.user._id;
      const user=await User.findById(userId)

      const recipe = await Recipe.findById(recipeId);
      if (recipe.likedBy.includes(userId)) {
        res.status(400).send("You have already liked this recipe");
      } else {
        user.favorites.push(recipeId)
        await user.save()
        recipe.likes += 1;
        recipe.likedBy.push(userId);
        await recipe.save();
        res.status(200).send(recipe);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
  async likeDecrement(req: AuthRequest, res: Response) {
    try {
      const recipeId = req.params.id;
      const userId = req.user._id;
      const user=await User.findById(userId)

      const recipe = await Recipe.findById(recipeId);
      if (recipe.likedBy.includes(userId)) {
        user.favorites=user.favorites.filter((id)=>id!==recipeId)
        await user.save()
        recipe.likes -= 1;
        recipe.likedBy = recipe.likedBy.filter((id) => id !== userId);
        await recipe.save();
        res.status(200).send(recipe);
      } else {
        res.status(400).send("You haven't like this recipe yet");
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
  async getUserRecipesAndFavorites(req: AuthRequest, res: Response) {
    try {
      const user = await User.findOne({username:req.params.name});
      const userFavorites = user.favorites;
      let favorites = [];
      for (let i = 0; i < userFavorites.length; i++) {
        const recipe = await Recipe.findById(userFavorites[i]);
        favorites.push(recipe);
      }
      const userRecipes = await Recipe.find({ author: user.username });

        return res.status(200).send({
          recipes: userRecipes,
          favorites: favorites,
        });
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
  async search(req: AuthRequest, res: Response) {
    const query = req.query.q;
    try {
      const results = await Recipe.find({ name: { $regex: query, $options: 'i' } });
      res.status(200).send(results);
    } catch (err) {
      res.status(500).json({ message: 'Error performing search', error: err });
    }
  }
  

  
}

export default new recipeController();
