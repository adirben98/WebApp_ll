import express from 'express';
import dotenv from 'dotenv';
import bookRouter from './Routes/bookRouter';
import userRouter from './Routes/userRouter';
import postRouter from './Routes/postRouter';

dotenv.config();

const app=express();
const port=process.env.PORT;


app.use('/user',userRouter)

app.use('/book',bookRouter)

app.use('/post',postRouter)

app.listen(port, ()=>{
    console.log('server started at http://localhost:${port}')
});