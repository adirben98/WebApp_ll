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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const recipeModel_1 = __importDefault(require("../models/recipeModel"));
const moment_1 = __importDefault(require("moment"));
const testComment1 = {
    content: "that is a great recipe",
};
const testComment2 = {
    content: "that is a bad recipe",
};
const testRecipe = {
    name: "mac&cheese",
    author: "IDAN",
    category: "breakfast",
    ingredients: ["cheese", "salt", "pasta", "cream"],
    instructions: "cook pasta, cook cream with salt ,add all with cheese",
    description: "nice dish to eat in the morning",
    image: "https://www.google.com/search?q=mac+and+cheese&rlz=1C1GCEU_enIL832IL832&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiJ9J6V9JLzAhXQzIUKHbJzDZQQ_AUIBygC&biw=1366&bih=657#imgrc=5",
    authorImg: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-512.png",
    createdAt: (0, moment_1.default)().format("MMMM Do YYYY, h:mm:ss a"),
    likedBy: [],
    likes: 0
};
const user1 = {
    "email": "Idan@gmail.com",
    "username": "Idan the chef",
    "password": "1234"
};
const user2 = {
    "email": "Eliav@gmail.com",
    "username": "Eliav the chef",
    "password": "12345"
};
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("Before all");
    yield userModel_1.default.deleteMany({});
    yield recipeModel_1.default.deleteMany({});
    yield commentModel_1.default.deleteMany({});
    yield (0, supertest_1.default)(app).post("/auth/register").send(user1);
    yield (0, supertest_1.default)(app).post("/auth/register").send(user2);
    const res1 = yield (0, supertest_1.default)(app).post("/auth/login").send(user1);
    const res2 = yield (0, supertest_1.default)(app).post("/auth/login").send(user2);
    user1.accessToken = res1.body.accessToken;
    user2.accessToken = res2.body.accessToken;
    const res = yield (0, supertest_1.default)(app).post("/recipe").set("Authorization", "Bearer " + user1.accessToken).send(testRecipe);
    testRecipe._id = res.body._id;
    testComment1.recipeId = testRecipe._id;
    testComment2.recipeId = testRecipe._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Comment Tests", () => {
    test("Post Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/comment").set("Authorization", "Bearer " + user1.accessToken).send(testComment1);
        expect(res.statusCode).toEqual(201);
        expect(res.body.content).toEqual("that is a great recipe");
        expect(res.body.author).toEqual("Idan the chef");
        expect(res.body.recipeId).toEqual(testRecipe._id);
        testComment1._id = res.body._id;
        testComment1.author = res.body.author;
        const res2 = yield (0, supertest_1.default)(app).post("/comment").set("Authorization", "Bearer " + user2.accessToken).send(testComment2);
        expect(res2.statusCode).toEqual(201);
        expect(res2.body.content).toEqual("that is a bad recipe");
        expect(res2.body.author).toEqual("Eliav the chef");
        expect(res2.body.recipeId).toEqual(testRecipe._id);
        testComment2._id = res2.body._id;
        testComment2.author = res2.body.author;
    }));
    test("Get Comments By Recipe Id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/comment/" + testRecipe._id).set("Authorization", "Bearer " + user2.accessToken).send();
        expect(res.statusCode).toEqual(200);
        expect(res.body[1].author).toEqual("Idan the chef");
        expect(res.body[1].content).toEqual("that is a great recipe");
        expect(res.body[1].recipeId).toEqual(testRecipe._id);
        expect(res.body[0].author).toEqual("Eliav the chef");
        expect(res.body[0].content).toEqual("that is a bad recipe");
        expect(res.body[0].recipeId).toEqual(testRecipe._id);
    }));
    test("Edit Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        testComment2.content = "changed my mind, it is a great recipe";
        const res = yield (0, supertest_1.default)(app).put("/comment").set("Authorization", "Bearer " + user2.accessToken).send(testComment2);
        expect(res.statusCode).toEqual(200);
        expect(res.body.content).toEqual("changed my mind, it is a great recipe");
        expect(res.body.author).toEqual("Eliav the chef");
        expect(res.body.recipeId).toEqual(testRecipe._id);
        expect(res.body.edited).toEqual(true);
    }));
    test("Delete Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/comment/" + testRecipe._id).set("Authorization", "Bearer " + user1.accessToken).send();
        const length = res.body.length;
        const res2 = yield (0, supertest_1.default)(app).delete("/comment/" + testComment2._id).set("Authorization", "Bearer " + user2.accessToken).send();
        expect(res2.statusCode).toEqual(200);
        const res3 = yield (0, supertest_1.default)(app).get("/comment/" + testRecipe._id).set("Authorization", "Bearer " + user1.accessToken).send();
        expect(res3.body.length).toEqual(length - 1);
    }));
});
//# sourceMappingURL=comment.test.js.map