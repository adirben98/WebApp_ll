import axios from "axios";
import { Request, Response } from "express";
const apiKey = "1";

const searchRecipes = async (req: Request, res: Response) => {
  const query = req.query.q;
  const url =
    "https://www.themealdb.com/api/json/v1/1/search.php" + "?s=" + query;
  try {
    const response = await axios.get(url, {
      params: {
        apiKey: apiKey,
      },
    });
    const recipes = response.data.meals
    let arr = [];
    for (let i = 0; i < recipes.length; i++) {
      arr.push(resToIrecipe(recipes[i]));
    }

    res.status(200).send(arr);
  } catch (error) {
    console.error("Error fetching recipe: ", error);
  }
};

const getOneRandomRecipe = async () => {
  const url = "https://www.themealdb.com/api/json/v1/1/random.php";

  try {
    const response = await axios.get(url, {
      params: {
        apiKey: apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recipe: ", error);
  }
};
const getFiveRandomRecipe = async (req: Request, res: Response) => {
  try {
    const recipes = [];
    while (recipes.length < 5) {
      const recipe = await getOneRandomRecipe();
      if (!recipes.includes(recipe)) {
        recipes.push(recipe.meals[0]);
      }
    }
    const arr = [];
    for (let i = 0; i < recipes.length; i++) {
        arr.push(resToIrecipe(recipes[i]));
    }
    res.status(200).send(arr);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


const resToIrecipe = (res: any) => {
  let ingredients = [];
  for (let j = 1; j <= 20; j++) {
    if (res[`strIngredient${j}`]) {
      ingredients.push(
        `${res[`strIngredient${j}`]} - ${res[`strMeasure${j}`]}`
      );
    } else {
      break;
    }
  }
  return {
    _id: res.idMeal,
    name: res.strMeal,
    category: res.strCategory,
    ingredients: ingredients,
    instructions: res.strInstructions,
    image: res.strMealThumb,
  };
};

export default { getFiveRandomRecipe, searchRecipes };
