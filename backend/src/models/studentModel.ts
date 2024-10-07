import mongoose, { Document, Schema } from "mongoose";

interface IStudent extends Document {
  username: string;
  email: string;
  password: string;
  profilePic?: string;
  otp?:string;
  isBlocked?:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const studentSchema: Schema<IStudent> = new Schema({
  username: {
    type: String,
    required: true,
    
  }, 
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  otp:{
   type:String
  },
  isBlocked:{
    type:Boolean,
    default:false
  }
}, {
  timestamps: true, 
});

const Student = mongoose.model<IStudent>('Student', studentSchema);

export default Student; 
