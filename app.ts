import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app=express();
const port=process.env.PORT;

app.listen(port, ()=>{
    console.log('server started at http://localhost:${port}')
});
app.use('/user',userRouter)

app.use('/book',bookRouter)

app.use('/post',postRouter)