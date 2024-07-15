import request from "supertest";
import init from "../app";
import mongoose from "mongoose";
import { App } from "supertest/types";
import Recipe, { IRecipe } from "../models/recipeModel";
import { TestUser } from "./auth.test";
import User from "../models/userModel";



const testRecipe: IRecipe = {
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
  createdAt: new Date(),
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
      "https://www.google.com/search?q=mac+and+cheese&rlz=1C1GCEU_enIL832IL832&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiJ9J6V9JLzAhXQzIUKHbJzDZQQ_AUIBygC&biw=1366&bih=657#imgrc=5"
    );
    expect(res.body.likes).toEqual(0);
    expect(res.body.likedBy).toEqual([]);

    testRecipe._id = res.body._id;
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
      "https://www.google.com/search?q=mac+and+cheese&rlz=1C1GCEU_enIL832IL832&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiJ9J6V9JLzAhXQzIUKHbJzDZQQ_AUIBygC&biw=1366&bih=657#imgrc=5"
    );
    expect(res.body.likes).toEqual(0);
    expect(res.body.likedBy).toEqual([]);
  });

  test("Get Top Five Recipe", async () => {
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

    const res3 = await request(app)
      .get("/recipe/" + testRecipe._id + "/like")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res3.statusCode).not.toEqual(200);
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

    const res3 = await request(app)
      .get("/recipe/" + testRecipe._id + "/unlike")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res3.statusCode).not.toEqual(200);
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
    expect(res3.body).toEqual({});
  });
});
