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
const userModel_1 = __importDefault(require("../models/userModel"));
const recipeModel_1 = __importDefault(require("../models/recipeModel"));
const google_auth_library_1 = require("google-auth-library");
const moment_1 = __importDefault(require("moment"));
jest.mock("google-auth-library");
const MockOAuth2Client = google_auth_library_1.OAuth2Client;
const user = {
    "email": "shlomi@gmail.com",
    "username": "Idan",
    "password": "445566"
};
const testRecipe = {
    name: "mac&cheese",
    author: "Eliav",
    category: "breakfast",
    ingredients: ["cheese", "salt", "pasta", "cream"],
    description: "nice dish to eat in the morning",
    instructions: "cook pasta, cook cream with salt ,add all with cheese",
    image: "https://www.google.com/search?q=mac+and+cheese&rlz=1C1GCEU_enIL832IL832&source=lnms&tbm=isch&sa=X&ved=0ahUKEwiJ9J6V9JLzAhXQzIUKHbJzDZQQ_AUIBygC&biw=1366&bih=657#imgrc=5",
    authorImg: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-512.png",
    createdAt: (0, moment_1.default)().format("MMMM Do YYYY, h:mm:ss a"),
    likedBy: [],
    likes: 0
};
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("Before all");
    yield userModel_1.default.deleteMany({ "email": user.email });
    yield recipeModel_1.default.deleteMany({ "author": "Idan" });
    MockOAuth2Client.prototype.verifyIdToken.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
        return {
            getPayload: () => ({
                email: "shlomi@gmail.com",
                name: "Idan",
                picture: "https://example.com/picture.jpg"
            })
        };
    }));
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Auth Tests", () => {
    test("Register", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
        expect(res.statusCode).toEqual(201);
    }));
    test("Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
        user.accessToken = res.body.accessToken;
        user.refreshToken = res.body.refreshToken;
    }));
    test("Middleware", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/recipe").send(testRecipe);
        expect(res.statusCode).not.toEqual(201);
        const res2 = yield (0, supertest_1.default)(app).post("/recipe").set("Authorization", "Bearer " + user.accessToken).send(testRecipe);
        expect(res2.statusCode).toEqual(201);
        testRecipe._id = res2.body._id;
    }));
    jest.setTimeout(10000);
    test("Refresh Token", () => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise(r => setTimeout(r, 6000));
        const res = yield (0, supertest_1.default)(app).get("/recipe/" + testRecipe._id).set("Authorization", "Bearer " + user.accessToken).send();
        expect(res.statusCode).not.toEqual(200);
        const res2 = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set("Authorization", "Bearer " + user.refreshToken)
            .send();
        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toHaveProperty("accessToken");
        expect(res2.body).toHaveProperty("refreshToken");
        user.accessToken = res2.body.accessToken;
        user.refreshToken = res2.body.refreshToken;
        const res3 = yield (0, supertest_1.default)(app).get("/recipe/" + testRecipe._id).set("Authorization", "Bearer " + user.accessToken).send();
        expect(res3.statusCode).toEqual(200);
    }));
    test("Refresh Token hacked", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set("Authorization", "Bearer " + user.refreshToken)
            .send();
        expect(res.statusCode).toEqual(200);
        const newRefreshToken = res.body.refreshToken;
        const res2 = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set("Authorization", "Bearer " + user.refreshToken)
            .send();
        expect(res2.statusCode).not.toEqual(200);
        const res3 = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set("Authorization", "Bearer " + newRefreshToken)
            .send();
        expect(res3.statusCode).not.toEqual(200);
    }));
    test("Logout", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
        user.accessToken = res.body.accessToken;
        user.refreshToken = res.body.refreshToken;
        const res2 = yield (0, supertest_1.default)(app).get("/auth/logout")
            .set("Authorization", "Bearer " + user.refreshToken)
            .send();
        expect(res2.statusCode).toEqual(200);
        const res3 = yield (0, supertest_1.default)(app).get("/auth/refresh")
            .set("Authorization", "Bearer " + user.refreshToken)
            .send();
        expect(res3.statusCode).not.toEqual(200);
    }));
    test("Check if Email is Taken", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/isEmailTaken").send({ email: user.email });
        expect(res.statusCode).toEqual(400);
    }));
    test("Check if Username is Taken", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/isUsernameTaken").send({ username: user.username });
        expect(res.statusCode).toEqual(400);
    }));
    test("Change Password", () => __awaiter(void 0, void 0, void 0, function* () {
        const newPassword = "newpassword123";
        const res = yield (0, supertest_1.default)(app).put("/auth/changePassword").set("Authorization", "Bearer " + user.accessToken)
            .send({
            username: user.username,
            oldPassword: user.password,
            newPassword: newPassword
        });
        expect(res.statusCode).toEqual(200);
        const res2 = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: user.email, password: newPassword });
        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toHaveProperty("accessToken");
        expect(res2.body).toHaveProperty("refreshToken");
        user.accessToken = res2.body.accessToken;
        user.refreshToken = res2.body.refreshToken;
    }));
    test("Update User Image", () => __awaiter(void 0, void 0, void 0, function* () {
        const newImage = "https://example.com/new-image.png";
        const res = yield (0, supertest_1.default)(app).put("/auth/updateUserImg")
            .set("Authorization", "Bearer " + user.accessToken)
            .send({ imgUrl: newImage });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("image", newImage);
    }));
    test("Check Token", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/checkToken")
            .set("Authorization", "Bearer " + user.accessToken)
            .send();
        expect(res.statusCode).toEqual(200);
    }));
    test("Google Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const googleCredentials = "mock-google-credentials";
        const res = yield (0, supertest_1.default)(app).post("/auth/googleLogin")
            .send({ credentials: googleCredentials });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
    }));
    test("Get User", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/auth/getUser/" + user.username)
            .set("Authorization", "Bearer " + user.accessToken)
            .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("username", user.username);
        expect(res.body).toHaveProperty("email", user.email);
    }));
});
//# sourceMappingURL=auth.test.js.map