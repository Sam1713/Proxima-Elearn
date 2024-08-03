import mongoose, { Schema } from "mongoose";

interface TutorTypes{
    tutorname:string;
    email:string;
    countrycode:string;
    phonenumber:string;
    password:string;
    bio:string;
    files:Array<string>
}

const TutorSchema:Schema=new Schema({
    tutorname:{
    type:String,
    required:true,
    unique:true
    },
    email:{
        type:String,
    required:true,
    unique: true
    },
    countrycode:{
        type:String,
        required:true,
    },
    phonenumber:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        required:true
    },
    files:{
        type:[String],
        unique:true
    }
})
const TutorModel = mongoose.model<TutorTypes>('Tutor', TutorSchema);

export default TutorModel;
