import axios from 'axios';
import { Request,Response } from 'express';

const getOneRandomRecipe = async () => {
    const apiKey = "1" 
    const url = "https://www.themealdb.com/api/json/v1/1/random.php" 

    try {
        const response = await axios.get(url, {
            params: {
                apiKey: apiKey 
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching recipe: ", error); 
    }
}
const getFiveRandomRecipe= async (req:Request,res:Response)=>{

    const recipes = []
    while (recipes.length<5){
        const recipe=await getOneRandomRecipe()
        if (!recipes.includes(recipe)) {
            recipes.push()
        }

    }
        
     
    res.status(200).send(recipes)
}

export default getFiveRandomRecipe