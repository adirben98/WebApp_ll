// import request from "supertest";
// import init from "../app";
// import mongoose from "mongoose";
// import book from "../models/bookmodel";
// import { App } from "supertest/types";
// import e from "express";

// type Testbook = {
//   _id: number;
//   name: string;
//   genre: string;
//   author: string;
// }

// const testbook: Testbook = {
//   _id: 1,
//   name: "superman",
//   genre: "science fiction",
//   author: "idan",
// }

// let app: App;
// beforeAll(async () => {
//   app = await init();
//   console.log("before all");
//   await book.deleteMany({});

// });

// afterAll(async () => {
//   await mongoose.connection.close();
// });


// describe("book Tests", () => {

//   //test for book get API
//   test("Test book get", async () => {
//     const res = await request(app)
//       .get("/book");
//       expect(res.statusCode).toEqual(200);
//       expect(res.body).toEqual([]);
//   })

//   //test for book post API
//   test("Test book post", async () => {
//     const res = await request(app)
//       .post("/book")
//       .send(testbook);
//       expect(res.statusCode).toEqual(201);
//       expect(res.body.name).toEqual(testbook.name);
//       expect(res.body.genre).toEqual(testbook.genre);
//       expect(res.body._id).toEqual(testbook._id);
//       expect(res.body.author).toEqual(testbook.author);
//     });
  
//   //test for book get by genre API  , supose to get all books with the same genre
//   test("Test book get by genre", async () => {
//     const books = await request(app).get("/book/:science fiction");
//     expect(books.statusCode).toEqual(200);
//     for (let i = 0; i < books.body.length; i++) {
//       expect(books.body[i].genre).toEqual("science fiction");
//     }
      
//   });

//   });