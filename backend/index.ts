import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'; // Import cookie-parser

import authRoute from './routes/authRoute'
import tutorauthRoute from './routes/tutorauthRoute'
import feedStudentRoute from './routes/feedStudentRoute'
import adminRoute from './routes/adminRoute'
import courseRoute from './routes/courseRoute'
import enrollementRoute from './routes/enrollementRoute'
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

const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies and credentials
};
app.use(bodyParser.json()); // for JSON data
app.use(bodyParser.urlencoded({ extended: true })); 
// CORS configuration
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // Handle form data


app.listen(3000,()=>{
    console.log("server is running on port 3000!")
})



app.use('/backend/auth',authRoute)
app.use('/backend/tutor',tutorauthRoute)
app.use('/backend/feed',feedStudentRoute)
app.use('/backend/admin',adminRoute)
app.use('/backend/course',courseRoute)
app.use('/backend/enroll',enrollementRoute)
// app.use((err:any,req:Request,res:Response,next:any)=>{
//     const statusCode:number=err.statusCode||500;
//     const message:string=err.message||'Internal Server Error'
//     return res.status(statusCode).json({
//         success:false,
//         message,
//         statusCode,
//     })
// })
