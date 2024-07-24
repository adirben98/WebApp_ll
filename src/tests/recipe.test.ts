import request from "supertest";
import init from "../app";
import mongoose from "mongoose";
import { App } from "supertest/types";
import Recipe, { IRecipe } from "../models/recipeModel";
import { TestUser } from "./auth.test";
import User from "../models/userModel";
import axios from 'axios';
import moment from "moment";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

let testRecipe: IRecipe = {
  name: "mac&cheese",
  author: "IDAN",
  category: "Italian",
  ingredients: ["cheese", "salt", "pasta", "cream"],
  instructions: "cook pasta, cook cream with salt ,add all with cheese",
  description: "nice dish to eat in the morning",
  image:
    "https://thebakermama.com/wp-content/uploads/2014/09/IMG_1588-scaled.jpg",
  likes: 0,
  likedBy: [],
  authorImg:
    "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-512.png",
  createdAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
};
const user: TestUser = {
  email: "Idan@gmail.com",
  username: "Idan the chef",
  password: "1234",
};

let app: App;
beforeAll(async () => {
  app = await init();
  console.log("Before all");
  await User.deleteMany({});
  await Recipe.deleteMany({});
  await request(app).post("/auth/register").send(user);
  const res = await request(app).post("/auth/login").send(user);
  user.accessToken = res.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Recipe Tests", () => {
  test("Post Recipe", async () => {
    const res = await request(app)
      .post("/recipe")
      .set("Authorization", "Bearer " + user.accessToken)
      .send(testRecipe);
    expect(res.statusCode).toEqual(201);
    expect(res.body.author).toEqual("Idan the chef");
    expect(res.body.name).toEqual("mac&cheese");
    expect(res.body.category).toEqual("Italian");
    expect(res.body.description).toEqual("nice dish to eat in the morning");
    expect(res.body.ingredients).toEqual(["cheese", "salt", "pasta", "cream"]);
    expect(res.body.instructions).toEqual(
      "cook pasta, cook cream with salt ,add all with cheese"
    );
    expect(res.body.image).toEqual(
      "https://thebakermama.com/wp-content/uploads/2014/09/IMG_1588-scaled.jpg"
    );
    expect(res.body.likes).toEqual(0);
    expect(res.body.likedBy).toEqual([]);

    testRecipe=res.body
  });

  test("Get Recipe By Id", async () => {
    const res = await request(app)
      .get("/recipe/" + testRecipe._id)
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("mac&cheese");
    expect(res.body.category).toEqual("Italian");
    expect(res.body.ingredients).toEqual(["cheese", "salt", "pasta", "cream"]);
    expect(res.body.instructions).toEqual(
      "cook pasta, cook cream with salt ,add all with cheese"
    );
    expect(res.body.description).toEqual("nice dish to eat in the morning");
    expect(res.body.image).toEqual(
      "https://thebakermama.com/wp-content/uploads/2014/09/IMG_1588-scaled.jpg"
    );
    expect(res.body.likes).toEqual(0);
    expect(res.body.likedBy).toEqual([]);
  });

  test("Get Top Five Recipes", async () => {
    const id = testRecipe._id;
    for (let i = 0; i < 10; i++) {
      testRecipe._id = undefined;

      testRecipe.name = "recipe" + i;
      testRecipe.likes = i;
      await request(app)
        .post("/recipe")
        .set("Authorization", "Bearer " + user.accessToken)
        .send(testRecipe);
    }
    const res = await request(app)
      .get("/recipe/topFive")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res.statusCode).toEqual(200);
    for (let i = 0; i < 5; i++) {
      expect(res.body[i].name).toEqual("recipe" + (9 - i));
      expect(res.body[i].likes).toEqual(9 - i);
    }
    testRecipe._id = id;
  });

  test("Edit Recipe", async () => {
    testRecipe.name = "mac&cheese";
    testRecipe.description = "nice dish to eat in the evening";
    testRecipe.category = "American";

    const res = await request(app)
      .put("/recipe/")
      .set("Authorization", "Bearer " + user.accessToken)
      .send(testRecipe);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(testRecipe._id);
    expect(res.body.name).toEqual("mac&cheese");
    expect(res.body.category).toEqual("American");
    expect(res.body.description).toEqual("nice dish to eat in the evening");
    expect(res.body.ingredients).toEqual(["cheese", "salt", "pasta", "cream"]);
    expect(res.body.instructions).toEqual(
      "cook pasta, cook cream with salt ,add all with cheese"
    );
  });

  test("Like Recipe", async () => {
    const res = await request(app)
      .get("/recipe/" + testRecipe._id)
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    const likes = res.body.likes;

    const res2 = await request(app)
      .post("/recipe/like/" + testRecipe._id + "")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.name).toEqual("mac&cheese");
    expect(res2.body.category).toEqual("American");
    expect(res2.body.ingredients).toEqual(["cheese", "salt", "pasta", "cream"]);
    expect(res2.body.instructions).toEqual(
      "cook pasta, cook cream with salt ,add all with cheese"
    );
    expect(res2.body.likes).toEqual(likes + 1);
  });

  test("Unlike Recipe", async () => {
    const res = await request(app)
      .get("/recipe/" + testRecipe._id)
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    const likes = res.body.likes;

    const res2 = await request(app)
      .post("/recipe/unlike/" + testRecipe._id + "")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.name).toEqual("mac&cheese");
    expect(res2.body.category).toEqual("American");
    expect(res2.body.ingredients).toEqual(["cheese", "salt", "pasta", "cream"]);
    expect(res2.body.instructions).toEqual(
      "cook pasta, cook cream with salt ,add all with cheese"
    );
    expect(res2.body.likes).toEqual(likes - 1);
  });

  test("Get Categories", async () => {
    const categories = {
      data: {
        categories: [
          { strCategory: 'Italian', strCategoryThumb: 'https://example.com/italian.jpg' },
          { strCategory: 'American', strCategoryThumb: 'https://example.com/american.jpg' },
          { strCategory: 'Mexican', strCategoryThumb: 'https://example.com/mexican.jpg' }
        ]
      }
    };
    mockedAxios.get.mockResolvedValue(categories);

    const res = await request(app)
      .get("/recipe/getCategories")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      { name: 'Italian', image: 'https://example.com/italian.jpg' },
      { name: 'American', image: 'https://example.com/american.jpg' },
      { name: 'Mexican', image: 'https://example.com/mexican.jpg' }
    ]);
  });

  test("Is Liked", async () => {
    const res = await request(app)
      .get("/recipe/isLiked/" + testRecipe._id)
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(false);

    await request(app)
      .post("/recipe/like/" + testRecipe._id + "")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();

    const res2 = await request(app)
      .get("/recipe/isLiked/" + testRecipe._id)
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res2.statusCode).toEqual(200);
    expect(res2.body).toEqual(true);
  });

  test("Get User Recipes And Favorites", async () => {
    const res = await request(app)
      .get("/recipe/getUserRecipesAndFavorites/" + user.username)
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body.recipes[0].name).toEqual("mac&cheese");
    expect(res.body.favorites[0].name).toEqual("mac&cheese");
  });

  test("Search Recipes", async () => {
    const res = await request(app)
      .get("/recipe/search?q=mac&cheese")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].name).toEqual("mac&cheese");
  });

  test("Search Recipes By Category", async () => {
    const categorySearchResponse = {
      data: {
        meals: [
          {
            idMeal: "52772",
            strMeal: "Spaghetti Carbonara",
            strCategory: "Italian",
            strArea: "Italian",
            strInstructions: "Instructions for Spaghetti Carbonara...",
            strMealThumb: "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg",
            strIngredient1: "Spaghetti",
            strIngredient2: "Egg Yolks",
            strIngredient3: "Pancetta",
            strIngredient4: "Parmesan Cheese",
            strIngredient5: "Black Pepper",
            strMeasure1: "400g",
            strMeasure2: "4",
            strMeasure3: "100g",
            strMeasure4: "50g",
            strMeasure5: "To Taste"
          }
        ]
      }
    };
  
    mockedAxios.get.mockResolvedValue(categorySearchResponse);
  
    const res = await request(app)
      .get("/recipe/categorySearch/Italian")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].category).toEqual("Italian");
    expect(res.body[0].name).toEqual("Spaghetti Carbonara");
    expect(res.body[0].ingredients).toEqual([
      "Spaghetti - 400g",
      "Egg Yolks - 4",
      "Pancetta - 100g",
      "Parmesan Cheese - 50g",
      "Black Pepper - To Taste"
    ]);
    expect(res.body[0].instructions).toEqual("Instructions for Spaghetti Carbonara...");
    expect(res.body[0].image).toEqual("https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg");
  });
  

  test("Get Five Random Recipes", async () => {
    const randomRecipe = {
      data: {
        meals: [
          {
            idMeal: "52772",
            strMeal: "Spaghetti Carbonara",
            strCategory: "Italian",
            strArea: "Italian",
            strInstructions: "Instructions for Spaghetti Carbonara...",
            strMealThumb: "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg",
            strTags: "Pasta,Italian",
            strYoutube: "https://www.youtube.com/watch?v=3AAdKl1UYZs",
            strIngredient1: "Spaghetti",
            strIngredient2: "Egg Yolks",
            strIngredient3: "Pancetta",
            strIngredient4: "Parmesan Cheese",
            strIngredient5: "Black Pepper",
            strMeasure1: "400g",
            strMeasure2: "4",
            strMeasure3: "100g",
            strMeasure4: "50g",
            strMeasure5: "To Taste"
          }
        ]
      }
    };
    mockedAxios.get.mockResolvedValue(randomRecipe);

    const res = await request(app)
      .get("/recipe/randomRESTApi")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(5);
    expect(res.body[0].name).toEqual("Spaghetti Carbonara");
  });

  test("Get Recipe By Name From API", async () => {
    const recipeByName = {
      data: {
        meals: [
          {
            idMeal: "52772",
            strMeal: "Spaghetti Carbonara",
            strCategory: "Italian",
            strArea: "Italian",
            strInstructions: "Instructions for Spaghetti Carbonara...",
            strMealThumb: "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg",
            strTags: "Pasta,Italian",
            strYoutube: "https://www.youtube.com/watch?v=3AAdKl1UYZs",
            strIngredient1: "Spaghetti",
            strIngredient2: "Egg Yolks",
            strIngredient3: "Pancetta",
            strIngredient4: "Parmesan Cheese",
            strIngredient5: "Black Pepper",
            strMeasure1: "400g",
            strMeasure2: "4",
            strMeasure3: "100g",
            strMeasure4: "50g",
            strMeasure5: "To Taste"
          }
        ]
      }
    };
    mockedAxios.get.mockResolvedValue(recipeByName);

    const res = await request(app)
      .get("/recipe/recipeFromApi/Spaghetti Carbonara")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Spaghetti Carbonara");
    expect(res.body.category).toEqual("Italian");
    expect(res.body.ingredients).toEqual([
      "Spaghetti - 400g",
      "Egg Yolks - 4",
      "Pancetta - 100g",
      "Parmesan Cheese - 50g",
      "Black Pepper - To Taste"
    ]);
    expect(res.body.instructions).toEqual("Instructions for Spaghetti Carbonara...");
  });

  test("Delete Recipe", async () => {
    const res = await request(app)
      .get("/recipe/" + testRecipe._id)
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res.statusCode).toEqual(200);
    const res2 = await request(app)
      .delete("/recipe/" + testRecipe._id)
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res2.statusCode).toEqual(200);
    const res3 = await request(app)
      .get("/recipe/" + testRecipe._id)
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res3.statusCode).toEqual(404); 
  });
});
