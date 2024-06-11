import request from "supertest";
import init from "../app";
import mongoose from "mongoose";
import { App } from "supertest/types";
import Comment from "../models/commentModel";
import {TestUser} from "./auth.test"
import User from "../models/userModel"
import Recipe from "../models/recipeModel"
import {IRecipe} from "./recipe.test"

interface TestComment {
    _id?: string;
    content:string
    recipeId?:string
    author?:string
}


const testComment1:TestComment = {
    content:"that is a great recipe",

}
const testComment2:TestComment = {
    content:"that is a bad recipe",
}

const testRecipe:IRecipe={
    
    name:"mac&cheese",
    author:"IDAN",
    category:"breakfast",
    ingredients:["cheese","salt","pasta","cream"],
    instructions:"cook pasta, cook cream with salt ,add all with cheese",
    image:"https://www.google.com/search?q=mac+and+cheese&rlz=1C1GCEU_enIL832IL832&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiJ9J6V9JLzAhXQzIUKHbJzDZQQ_AUIBygC&biw=1366&bih=657#imgrc=5",
    
}
const user1: TestUser = {
    
    "email": "Idan@gmail.com",
    "username":"Idan the chef",
    "password": "1234"
  }
  const user2: TestUser = {
    
    "email": "Eliav@gmail.com",
    "username":"Eliav the chef",
    "password": "12345"
  }
  let app: App;
beforeAll(async () => {
    app = await init();
    console.log("Before all");
    await User.deleteMany({ email: user1.email });
    await User.deleteMany({ email: user2.email });
    await Recipe.deleteMany({ author:"Idan the chef"})
    await Comment.deleteMany({ author:"Eliav the chef"})
    await Comment.deleteMany({ author:"Idan the chef"})
    await request(app).post("/auth/register").send(user1);
    await request(app).post("/auth/register").send(user2);
    const res1 = await request(app).post("/auth/login").send(user1);
    const res2 = await request(app).post("/auth/login").send(user2);
    user1.accessToken = res1.body.accessToken;
    user2.accessToken = res2.body.accessToken;
    const res=await request(app).post("/recipe").set("Authorization","Bearer "+user1.accessToken).send(testRecipe);
    testRecipe._id=res.body._id
    testComment1.recipeId=testRecipe._id
    testComment2.recipeId=testRecipe._id
})
afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("Comment Tests", () => {
    test("Post Comment",async ()=>{
        const res = await request(app).post("/comment").set("Authorization", "Bearer " + user1.accessToken).send(testComment1);
        expect(res.statusCode).toEqual(201);
        expect(res.body.content).toEqual("that is a great recipe")
        expect(res.body.author).toEqual("Idan the chef")
        expect(res.body.recipeId).toEqual(testRecipe._id)
        testComment1._id=res.body._id
        testComment1.author=res.body.author

        const res2 = await request(app).post("/comment").set("Authorization", "Bearer " + user2.accessToken).send(testComment2);
        expect(res2.statusCode).toEqual(201);
        expect(res2.body.content).toEqual("that is a bad recipe")
        expect(res2.body.author).toEqual("Eliav the chef")
        expect(res2.body.recipeId).toEqual(testRecipe._id)
        testComment2._id=res2.body._id
        testComment2.author=res2.body.author
    })
  
    
    test("Get Comments By Recipe Id", async () => {
        const res = await request(app).get("/comment/"+testRecipe._id).set("Authorization", "Bearer " + user1.accessToken).send();
        expect(res.statusCode).toEqual(200);
        expect(res.body[0].author).toEqual("Idan the chef")
        expect(res.body[0].content).toEqual("that is a great recipe")
        expect(res.body[0].recipeId).toEqual(testRecipe._id)
        expect(res.body[1].author).toEqual("Eliav the chef")
        expect(res.body[1].content).toEqual("that is a bad recipe")
        expect(res.body[1].recipeId).toEqual(testRecipe._id)
    })

    test("Edit Comment",async () => {
        testComment2.content="changed my mind, it is a great recipe"
        const res=await request(app).put("/comment").set("Authorization","Bearer "+user2.accessToken).send(testComment2)
        expect(res.statusCode).toEqual(200)
        expect(res.body.content).toEqual("changed my mind, it is a great recipe")
        expect(res.body.author).toEqual("Eliav the chef")
        expect(res.body.recipeId).toEqual(testRecipe._id)
        expect(res.body.edited).toEqual(true)
    })

    test("Delete Comment",async () => {
        const res = await request(app).get("/comment/"+testRecipe._id).set("Authorization", "Bearer " + user1.accessToken).send();
        const length=res.body.length
        const res2=await request(app).delete("/comment/"+testComment2._id).set("Authorization","Bearer "+user2.accessToken).send()
        expect(res2.statusCode).toEqual(200)
        const res3=await request(app).get("/comment/"+testRecipe._id).set("Authorization", "Bearer " + user1.accessToken).send();
        expect(res3.body.length).toEqual(length-1)
    })





})


