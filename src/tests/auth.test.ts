import request from "supertest";
import init from "../app";
import mongoose from "mongoose";
import { App } from "supertest/types";
import User from "../models/userModel";
import Recipe, { IRecipe } from "../models/recipeModel";
import { OAuth2Client } from "google-auth-library";
import moment from "moment";

jest.mock("google-auth-library");

const MockOAuth2Client = OAuth2Client as jest.MockedClass<typeof OAuth2Client>;

export type TestUser = {
  email: string,
  username: string,
  password: string,
  accessToken?: string,
  refreshToken?: string
}

const user: TestUser = {
  "email": "shlomi@gmail.com",
  "username": "Idan",
  "password": "445566"
}

const testRecipe: IRecipe = {
  name: "mac&cheese",
  author: "Eliav",
  category: "breakfast",
  ingredients: ["cheese", "salt", "pasta", "cream"],
  description: "nice dish to eat in the morning",
  instructions: "cook pasta, cook cream with salt ,add all with cheese",
  image: "https://www.google.com/search?q=mac+and+cheese&rlz=1C1GCEU_enIL832IL832&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiJ9J6V9JLzAhXQzIUKHbJzDZQQ_AUIBygC&biw=1366&bih=657#imgrc=5",
  authorImg: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-512.png",
  createdAt: moment().format("MMMM Do YYYY, h:mm:ss a")
  , likedBy: [],
  likes: 0
}

let app: App;

beforeAll(async () => {
  app = await init();
  console.log("Before all");
  await User.deleteMany({ "email": user.email });
  await Recipe.deleteMany({ "author": "Idan" });

  MockOAuth2Client.prototype.verifyIdToken.mockImplementation(async () => {
    return {
      getPayload: () => ({
        email: "shlomi@gmail.com",
        name: "Idan",
        picture: "https://example.com/picture.jpg"
      })
    };
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Tests", () => {
  test("Register", async () => {
    const res = await request(app).post("/auth/register").send(user);
    expect(res.statusCode).toEqual(201);
  });

  test("Login", async () => {
    const res = await request(app).post("/auth/login").send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;
  });

  test("Middleware", async () => {
    const res = await request(app).post("/recipe").send(testRecipe);
    expect(res.statusCode).not.toEqual(201);

    const res2 = await request(app).post("/recipe").set("Authorization", "Bearer " + user.accessToken).send(testRecipe);
    expect(res2.statusCode).toEqual(201);
    testRecipe._id = res2.body._id;
  });

  jest.setTimeout(10000);

  test("Refresh Token", async () => {
    await new Promise(r => setTimeout(r, 6000));
    const res = await request(app).get("/recipe/" + testRecipe._id).set("Authorization", "Bearer " + user.accessToken).send();
    expect(res.statusCode).not.toEqual(200);

    const res2 = await request(app).get("/auth/refresh")
      .set("Authorization", "Bearer " + user.refreshToken)
      .send();
    expect(res2.statusCode).toEqual(200);
    expect(res2.body).toHaveProperty("accessToken");
    expect(res2.body).toHaveProperty("refreshToken");
    user.accessToken = res2.body.accessToken;
    user.refreshToken = res2.body.refreshToken;

    const res3 = await request(app).get("/recipe/" + testRecipe._id).set("Authorization", "Bearer " + user.accessToken).send();
    expect(res3.statusCode).toEqual(200);
  });

  test("Refresh Token hacked", async () => {
    const res = await request(app).get("/auth/refresh")
      .set("Authorization", "Bearer " + user.refreshToken)
      .send();
    expect(res.statusCode).toEqual(200);
    const newRefreshToken = res.body.refreshToken;
    const res2 = await request(app).get("/auth/refresh")
      .set("Authorization", "Bearer " + user.refreshToken)
      .send();
    expect(res2.statusCode).not.toEqual(200);
    const res3 = await request(app).get("/auth/refresh")
      .set("Authorization", "Bearer " + newRefreshToken)
      .send();
    expect(res3.statusCode).not.toEqual(200);
  });

  test("Logout", async () => {
    const res = await request(app).post("/auth/login").send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    user.accessToken = res.body.accessToken;
    user.refreshToken = res.body.refreshToken;

    const res2 = await request(app).get("/auth/logout")
      .set("Authorization", "Bearer " + user.refreshToken)
      .send();
    expect(res2.statusCode).toEqual(200);

    const res3 = await request(app).get("/auth/refresh")
      .set("Authorization", "Bearer " + user.refreshToken)
      .send();
    expect(res3.statusCode).not.toEqual(200);
  });

  test("Check if Email is Taken", async () => {
    const res = await request(app).post("/auth/isEmailTaken").send({ email: user.email });
    expect(res.statusCode).toEqual(400);
  });

  test("Check if Username is Taken", async () => {
    const res = await request(app).post("/auth/isUsernameTaken").send({ username: user.username });
    expect(res.statusCode).toEqual(400);
  });

  test("Change Password", async () => {
    const newPassword = "newpassword123";
    const res = await request(app).put("/auth/changePassword").set("Authorization", "Bearer " + user.accessToken)
      .send({
        username: user.username,
        oldPassword: user.password,
        newPassword: newPassword
      });
    expect(res.statusCode).toEqual(200);

    const res2 = await request(app).post("/auth/login").send({ email: user.email, password: newPassword });
    expect(res2.statusCode).toEqual(200);
    expect(res2.body).toHaveProperty("accessToken");
    expect(res2.body).toHaveProperty("refreshToken");
    user.accessToken = res2.body.accessToken;
    user.refreshToken = res2.body.refreshToken;
  });

  test("Update User Image", async () => {
    const newImage = "https://example.com/new-image.png";
    const res = await request(app).put("/auth/updateUserImg")
      .set("Authorization", "Bearer " + user.accessToken)
      .send({  imgUrl: newImage });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("image", newImage);
  });

  test("Check Token", async () => {
    const res = await request(app).post("/auth/checkToken")
      .set("Authorization", "Bearer " + user.accessToken)
      .send();
    expect(res.statusCode).toEqual(200);
  });

  test("Google Login", async () => {
    const googleCredentials = "mock-google-credentials"; 
    const res = await request(app).post("/auth/googleLogin")
      .send({ credentials: googleCredentials });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });
});
