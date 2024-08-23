import mongoose, { Document, Schema } from 'mongoose';

interface IFeed extends Document {
  title: string;
  content: string;
  files: string[];
  student: mongoose.Schema.Types.ObjectId; 
  createdAt?: Date;
  updatedAt?: Date;
}

const FeedSchema: Schema = new Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, 
  title: { type: String, required: true },
  content: { type: String, required: true },
  files: [
    {
        url: { type: String, required: true },
        fileType: { type: String, required: true }
    }
] 

}, {
  timestamps: true 
});

const Feed = mongoose.model<IFeed>('Feed', FeedSchema);

export default Feed;
