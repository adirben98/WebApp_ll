import express from 'express';
const Router=express.Router();
import getFiveRandomRecipe from "../controllers/restApi"

Router.get("/getFiveRestApiRecipes",getFiveRandomRecipe)

export default Router
