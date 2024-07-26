import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import authRoute from './routes/authRoute'
dotenv.config();

const mongoUri = process.env.MONGO as string;

if (!mongoUri) {
  throw new Error('MongoDB URI is not defined in the environment variables');
}


mongoose.connect(mongoUri).then(()=>{
    console.log('MongoDb connected')
}).catch((err)=>{
    console.log(err)
})
const app=express()
app.use(express.json())


app.listen(3000,()=>{
    console.log("server is running on port 3000!")
})



app.use('/backend/auth',authRoute)
// app.use((err:any,req:Request,res:Response,next:any)=>{
//     const statusCode:number=err.statusCode||500;
//     const message:string=err.message||'Internal Server Error'
//     return res.status(statusCode).json({
//         success:false,
//         message,
//         statusCode,
//     })
// })