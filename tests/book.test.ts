import request from "supertest";
import init from "../app";
import mongoose from "mongoose";
import book from "../models/bookmodel";
import { app } from "supertest/types";


describe("book Tests", () => {
    test("Test book get", async () => {
      const res = await request(app)
        .get("/book");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    })
})