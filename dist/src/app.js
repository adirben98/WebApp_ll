"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const fileRouter_1 = __importDefault(require("./Routes/fileRouter"));
const recipeRouter_1 = __importDefault(require("./Routes/recipeRouter"));
const commentRouter_1 = __importDefault(require("./Routes/commentRouter"));
const authRouter_1 = __importDefault(require("./Routes/authRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const init = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.on("error", (error) => console.error(error));
        db.once("open", () => console.log("connected to database"));
        mongoose_1.default.connect(process.env.DATABASE_URL).then(() => {
            const options = {
                definition: {
                    openapi: "3.0.0",
                    info: {
                        title: "Web Dev 2022 REST API",
                        version: "1.0.0",
                        description: "REST server including authentication using JWT",
                    },
                    servers: [{ url: "http://localhost:3000", },],
                },
                apis: ["./src/Routes/*.ts"],
            };
            const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use(body_parser_1.default.json());
            app.use((0, cors_1.default)());
            app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
            app.use("/file", fileRouter_1.default);
            app.use("/auth", authRouter_1.default);
            app.use("/recipe", recipeRouter_1.default);
            app.use("/comment", commentRouter_1.default);
            app.use('/public', express_1.default.static("public"));
            resolve(app);
        });
    });
    return promise;
};
exports.default = init;
//# sourceMappingURL=app.js.map