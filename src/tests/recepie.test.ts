import request from "supertest";
import init from "../app";
import mongoose from "mongoose";
import { App } from "supertest/types";
import Recepie from "../models/recepieModel"
import {TestUser} from "./auth.test"
import User from "../models/userModel"


const testRecepie={
    _id: "12345",
    name:"mac&cheese",
    author:"IDAN",
    category:"breakfast",
    ingredients:["cheese","salt","pasta","cream"],
    instructions:["cook pasta","cook cream with salt","add all with cheese"],
    image:"https://www.google.com/search?q=mac+and+cheese&rlz=1C1GCEU_enIL832IL832&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiJ9J6V9JLzAhXQzIUKHbJzDZQQ_AUIBygC&biw=1366&bih=657#imgrc=5",
    likes:0
}
const user: TestUser = {
    
    "email": "Idan@gmail.com",
    "full_name":"Idan the chef",
    "password": "1234"
  }

let app: App;
beforeAll(async () => {
  app = await init();
  console.log("Before all");
  await User.deleteMany({ email: user.email });
  await Recepie.deleteMany({ author:"Idan the chef" });
  await request(app).post("/auth/register").send(user);
  const res = await request(app).post("/auth/login").send(user);
  user.accessToken = res.body.accessToken;
})

afterAll(async () => {
    await mongoose.connection.close();
  });

describe("Recepie Tests", () => { 
    test("Post Recepie",async ()=>{
        const res = await request(app).post("/recepie").set("Authorization", "Bearer " + user.accessToken).send(testRecepie);
        expect(res.statusCode).toEqual(201);
        expect(res.body.author).toEqual("Idan the chef")
        expect(res.body.name).toEqual("mac&cheese")
        expect(res.body.category).toEqual("breakfast")
        expect(res.body.ingredients).toEqual(["cheese","salt","pasta","cream"])
        expect(res.body.instructions).toEqual(["cook pasta","cook cream with salt","add all with cheese"])
        expect(res.body.image).toEqual("https://www.google.com/search?q=mac+and+cheese&rlz=1C1GCEU_enIL832IL832&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiJ9J6V9JLzAhXQzIUKHbJzDZQQ_AUIBygC&biw=1366&bih=657#imgrc=5")



    }) 


    test("Get Recepie By Id", async () => {
        const res = await request(app).get("/recepie/"+testRecepie._id).set("Authorization", "Bearer " + user.accessToken).send();
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual("mac&cheese")
        expect(res.body.category).toEqual("breakfast")
        expect(res.body.ingredients).toEqual(["cheese","salt","pasta","cream"])
        expect(res.body.instructions).toEqual(["cook pasta","cook cream with salt","add all with cheese"])


    })

    test("Edit Recepie",async () => {
        testRecepie.category="dinner"
        const res = await request(app).put("/recepie/").set("Authorization", "Bearer " + user.accessToken).send(testRecepie);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual("mac&cheese")
        expect(res.body.category).toEqual("dinner")
        expect(res.body.ingredients).toEqual(["cheese","salt","pasta","cream"])
        expect(res.body.instructions).toEqual(["cook pasta","cook cream with salt","add all with cheese"])


    })
    test("Delete Recepie",async () => {
        const res = await request(app).delete("/recepie/").set("Authorization", "Bearer " + user.accessToken).send(testRecepie);
        expect(res.statusCode).toEqual(200);
        const recepie=await Recepie.find(testRecepie)
        expect(recepie).toEqual([])
    })





    })

