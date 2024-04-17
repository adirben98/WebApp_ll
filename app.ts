import express, {Express} from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookRouter from './Routes/bookRouter';
import userRouter from './Routes/userRouter';
import postRouter from './Routes/postRouter';
import bodyParser from 'body-parser';
const app=express();
dotenv.config();
const init = () => {
    const promise = new Promise<Express>((resolve) => {
      const db = mongoose.connection;
      db.on("error", (error) => console.error(error));
      db.once("open", () => console.log("connected to database"));
      mongoose.connect(process.env.DATABASE_URL).then(() => {
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
  
        app.use("/book", bookRouter);
        app.use("/post", postRouter);
        app.use("/user", userRouter);
        resolve(app);
      });
    });
    return promise;
  };
  
  export default init;