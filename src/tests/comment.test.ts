import request from "supertest";
import init from "../app";
import mongoose from "mongoose";
import { App } from "supertest/types";
import Comment from "../models/commentModel";
import {TestUser} from "./auth.test"
import User from "../models/userModel"
import Recepie from "../models/recepieModel"

    
const testComment1 = {
    _id:"11111",
    content:"that is a great recepie",
    recepieId:""

}
const testComment2 = {
    _id:"22222",
    content:"that is a bad recepie",
    recepieId:""
}

const testRecepie={
    _id:"12345",
    name:"mac&cheese",
    author:"IDAN",
    category:"breakfast",
    ingredients:["cheese","salt","pasta","cream"],
    instructions:["cook pasta","cook cream with salt","add all with cheese"],
    image:"https://www.google.com/search?q=mac+and+cheese&rlz=1C1GCEU_enIL832IL832&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiJ9J6V9JLzAhXQzIUKHbJzDZQQ_AUIBygC&biw=1366&bih=657#imgrc=5",
    likes:0
}
const user1: TestUser = {
    
    "email": "Idan@gmail.com",
    "full_name":"Idan the chef",
    "password": "1234"
  }
  const user2: TestUser = {
    
    "email": "Eliav@gmail.com",
    "full_name":"Eliav the chef",
    "password": "12345"
  }
  let app: App;
beforeAll(async () => {
    app = await init();
    console.log("Before all");
    await User.deleteMany({ email: user1.email });
    await User.deleteMany({ email: user2.email });
    await Recepie.deleteMany({ author:"Idan the chef"})
    await Comment.deleteMany({ author:"Eliav the chef"})
    await Comment.deleteMany({ author:"Idan the chef"})
    await request(app).post("/auth/register").send(user1);
    await request(app).post("/auth/register").send(user2);
    const res1 = await request(app).post("/auth/login").send(user1);
    const res2 = await request(app).post("/auth/login").send(user2);
    user1.accessToken = res1.body.accessToken;
    user2.accessToken = res2.body.accessToken;
    const res=await request(app).post("/recepie").set("Authorization","Bearer "+user1.accessToken).send(testRecepie);
    testRecepie._id=res.body._id
    testComment1.recepieId=testRecepie._id
    testComment2.recepieId=testRecepie._id
})
afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("Comment Tests", () => {
    test("Post Comment",async ()=>{
        const res = await request(app).post("/comment").set("Authorization", "Bearer " + user1.accessToken).send(testComment1);
        expect(res.statusCode).toEqual(201);
        expect(res.body.content).toEqual("that is a great recepie")
        expect(res.body.author).toEqual("Idan the chef")
        expect(res.body.recepieId).toEqual(testRecepie._id)
        const res2 = await request(app).post("/comment").set("Authorization", "Bearer " + user2.accessToken).send(testComment2);
        expect(res2.statusCode).toEqual(201);
        expect(res2.body.content).toEqual("that is a bad recepie")
        expect(res2.body.author).toEqual("Eliav the chef")
        expect(res2.body.recepieId).toEqual(testRecepie._id)
    })
  
    
    test("get comments by recepie id", async () => {
        const res = await request(app).get("/comment/"+testRecepie._id).set("Authorization", "Bearer " + user1.accessToken).send();
        expect(res.statusCode).toEqual(200);
        expect(res.body[0].author).toEqual("Idan the chef")
        expect(res.body[0].content).toEqual("that is a great recepie")
        expect(res.body[0].recepieId).toEqual("12345")
        expect(res.body[1].author).toEqual("Eliav the chef")
        expect(res.body[1].content).toEqual("that is a bad recepie")
        expect(res.body[1].recepieId).toEqual(testRecepie._id)
    })

    test("edit comment",async () => {
        testComment2.content="changed my mind, it is a great recepie"
        const res=await request(app).put("/comment").set("Authorization","Bearer "+user2.accessToken).send(testComment2)
        expect(res.statusCode).toEqual(200)
        expect(res.body.content).toEqual("changed my mind, it is a great recepie")
        expect(res.body.author).toEqual("Eliav the chef")
        expect(res.body.recepieId).toEqual(testRecepie._id)
    })

    test("Delete Comment",async () => {
        const res = await request(app).get("/comment/"+testRecepie._id).set("Authorization", "Bearer " + user1.accessToken).send();
        const length=res.body.length
        const res2=await request(app).delete("/comment").set("Authorization","Bearer "+user2.accessToken).send(testComment2)
        expect(res.statusCode).toEqual(200)
        const res3=await request(app).get("/comment/"+testRecepie._id).set("Authorization", "Bearer " + user1.accessToken).send();
        expect(res3.body.length).toEqual(length-1)
    })





})


