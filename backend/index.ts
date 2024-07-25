import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();

const mongoUri = process.env.MONGO as string;

if (!mongoUri) {
  throw new Error('MongoDB URI is not defined in the environment variables');
}
console.log('MongoDB URI:', mongoUri); // Add this line to verify the URI


mongoose.connect(mongoUri).then(()=>{
    console.log('MongoDb connected')
}).catch((err)=>{
    console.log(err)
})
const app=express()


app.listen(3000,()=>{
    console.log("server is running on port 3000!")
})

