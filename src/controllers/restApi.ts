import axios from "axios";
import { Request, Response } from "express";
const apiKey = "1";

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
    description:res.strArea
  };
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    let arr = [];
    for (let i = 0; i < categories.data.categories.length; i++) {
      arr.push({ name: categories.data.categories[i].strCategory, image: categories.data.categories[i].strCategoryThumb });
    }
    res.status(200).send(arr);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const categorySearch=async(req: Request, res: Response) =>{
  const category = req.params.name;
  try {
    const results=await axios.get("https://www.themealdb.com/api/json/v1/1/filter.php?c="+category);
    const arr=[]
    for (let i=0;i<results.data.meals.length;i++){
      arr.push({name:results.data.meals[i].strMeal, image:results.data.meals[i].strMealThumb});
    }
    res.status(200).send(arr);
  } catch (err) {
    res.status(500).json({ message: 'Error performing search', error: err });
  }
}
const getRecipeByName = async (req: Request, res: Response) => {
  const name = req.params.name;
  try {
    const results = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/search.php?s=" + name
    );
    res.status(200).send(resToIrecipe(results.data.meals[0]));
  } catch (err) {
    res.status(500).json({ message: 'Error performing search', error: err });
  }
}

export default { getFiveRandomRecipe, getCategories ,categorySearch,getRecipeByName};
