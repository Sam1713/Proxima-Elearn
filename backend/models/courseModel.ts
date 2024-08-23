import mongoose, { Document, Schema } from 'mongoose';

// Define the Video interface
interface Video {
  _id: mongoose.Types.ObjectId; // Change from string to ObjectId
  fileUrl: string;
  description: string;
}

export interface CourseDocument extends Document {
  title: string;
  category: string;
  description: string;
  AboutCourse: string;
  lessons: string;
  price: number;
  coverImageUrl: string;
  coverVideoUrl: string;
  videos: Video[];
  tutorId: mongoose.Types.ObjectId; 
  isDelete?:boolean;
}

const courseSchema = new Schema<CourseDocument>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  AboutCourse: { type: String, required: true },
  lessons: { type: String, required: true },
  price: { type: Number, required: true },
  coverImageUrl: { type: String, required: true },
  coverVideoUrl: { type: String, required: true },
  videos: [
    {
      fileUrl: { type: String, required: true },
      description: { type: String, required: true },
      _id:{type: Schema.Types.ObjectId}
    },
  ],
  tutorId: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true }, 
  isDelete:{
    type:Boolean,
    default:false
  }
});

const CourseModel = mongoose.model<CourseDocument>('Course', courseSchema);

export default CourseModel;
