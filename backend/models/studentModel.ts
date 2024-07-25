import mongoose, { Document, Schema } from "mongoose";

interface IStudent extends Document {
  username: string;
  email: string;
  password: string;
  confirmPassword?:string;
  profile?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const studentSchema: Schema<IStudent> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
  confirmPassword:{
    type:String
  },
  profile: {
    type: String,
  },
}, {
  timestamps: true, 
});

const Student = mongoose.model<IStudent>('Student', studentSchema);

export default Student;
