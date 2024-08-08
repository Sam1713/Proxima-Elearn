import mongoose, { Document, Schema } from 'mongoose';

interface IFeed extends Document {
  title: string;
  content: string;
  files: string[]; // Array of file URLs as strings
  student: mongoose.Schema.Types.ObjectId; // Reference to the user
  createdAt?: Date;
  updatedAt?: Date;
}

const FeedSchema: Schema = new Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // Add user reference
  title: { type: String, required: true },
  content: { type: String, required: true },
  files: [
    {
        url: { type: String, required: true },
        fileType: { type: String, required: true }
    }
] 

}, {
  timestamps: true // Add this to automatically handle createdAt and updatedAt fields
});

const Feed = mongoose.model<IFeed>('Feed', FeedSchema);

export default Feed;
