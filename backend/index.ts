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

app.get('/',(req,res)=>{
    res.json({
        message:'API is working'
    })
})

app.use('/backend/auth',authRoute)