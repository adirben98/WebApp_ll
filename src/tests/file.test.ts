import init from "../app";
import request from "supertest";
import mongoose from "mongoose";
import { App } from "supertest/types";
import path from "path";

let app: App;

beforeAll(async () => {
    app = await init();
    console.log("beforeAll");
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = path.join(__dirname, 'image.png');

        try {
            const response = await request(app)
                .post("/file?file=123.png").attach('file', filePath)
            expect(response.statusCode).toEqual(200);
            let url = response.body.url;
            url = url.replace(/^.*\/\/[^/]+/, '')
            const res = await request(app).get(url)
            expect(res.statusCode).toEqual(200);
        } catch (err) {
            console.log(err);
            expect(1).toEqual(2);
        }
    })
})