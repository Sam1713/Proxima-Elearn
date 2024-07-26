import mongoose, { Document, Schema } from "mongoose";

interface IStudent extends Document {
  username: string;
  email: string;
  password: string;
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
  profile: {
    type: String,
  },
}, {
  timestamps: true, 
});

const Student = mongoose.model<IStudent>('Student', studentSchema);

export default Student;
