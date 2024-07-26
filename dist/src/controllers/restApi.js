"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const apiKey = "1";
const getOneRandomRecipe = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://www.themealdb.com/api/json/v1/1/random.php";
    try {
        const response = yield axios_1.default.get(url, {
            params: {
                apiKey: apiKey,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching recipe: ", error);
    }
});
const getFiveRandomRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipes = [];
        while (recipes.length < 5) {
            const recipe = yield getOneRandomRecipe();
            if (!recipes.includes(recipe)) {
                recipes.push(recipe.meals[0]);
            }
        }
        const arr = [];
        for (let i = 0; i < recipes.length; i++) {
            arr.push(resToIrecipe(recipes[i]));
        }
        res.status(200).send(arr);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});
const resToIrecipe = (res) => {
    let ingredients = [];
    for (let j = 1; j <= 20; j++) {
        if (res[`strIngredient${j}`]) {
            ingredients.push(`${res[`strIngredient${j}`]} - ${res[`strMeasure${j}`]}`);
        }
        else {
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
        description: res.strArea
    };
};
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield axios_1.default.get("https://www.themealdb.com/api/json/v1/1/categories.php");
        let arr = [];
        for (let i = 0; i < categories.data.categories.length; i++) {
            arr.push({ name: categories.data.categories[i].strCategory, image: categories.data.categories[i].strCategoryThumb });
        }
        res.status(200).send(arr);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
});
const categorySearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = req.params.name;
    try {
        const results = yield axios_1.default.get("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category);
        const arr = [];
        for (let i = 0; i < results.data.meals.length; i++) {
            arr.push(resToIrecipe(results.data.meals[i]));
        }
        res.status(200).send(arr);
    }
    catch (err) {
        res.status(500).json({ message: 'Error performing search', error: err });
    }
});
const getRecipeByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.params.name;
    try {
        const results = yield axios_1.default.get("https://www.themealdb.com/api/json/v1/1/search.php?s=" + name);
        if (results.data.meals === null) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }
        res.status(200).send(resToIrecipe(results.data.meals[0]));
    }
    catch (err) {
        res.status(500).json({ message: 'Error performing search', error: err });
    }
});
exports.default = { getFiveRandomRecipe, getCategories, categorySearch, getRecipeByName };
//# sourceMappingURL=restApi.js.map