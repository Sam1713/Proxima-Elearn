import mongoose, { Document, Schema } from "mongoose";

interface AdminType{
username:string;
email:string;
password:string;
profilePic?:string
}

const AdminSchema:Schema=new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true 
    }, 
    password:{
        type:String,
        required:true
    }, 
    profilePic:{
        type:String
    }
})

const Admin = mongoose.model<AdminType>('Admin', AdminSchema);

export default Admin;
