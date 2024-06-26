import express, { Express } from "express";
const app = express();
import fileRoute from "./Routes/fileRouter";
import recipeRouter from "./Routes/recipeRouter";
import commentRouter from "./Routes/commentRouter";
import authRouter from "./Routes/authRouter";
import restApiRouter from "./Routes/restApiRouter";
import env from "dotenv"
env.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors";


const init = () => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("connected to database"));
    mongoose.connect(process.env.DATABASE_URL).then(() => {

      const options = {
        definition: {
        openapi: "3.0.0",
        info: {
        title: "Web Dev 2022 REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT",
        },
        servers: [{url: "http://localhost:3000",},],
        },
        apis: ["./src/Routes/*.ts"],
        };
        
      const swaggerSpec = swaggerJsdoc(options);

      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());


      // app.use((req, res, next) => {
      //   res.header("Access-Control-Allow-Origin", "*");
      //   res.header("Access-Control-Allow-Headers","*");
      //   res.header("Access-Control-Allow-Methods","*");
        
      //   next();
      // })
      app.use(cors());
      app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
      app.use("/file", fileRoute);
      app.use("/auth", authRouter);
      app.use("/recipe", recipeRouter);
      app.use("/comment", commentRouter);
      app.use("/restApi",restApiRouter)
      app.use('/public',express.static("public"))


      resolve(app);
    });
  });
  return promise;
};

export default init;