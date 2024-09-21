import mongoose, { Document, Schema } from 'mongoose';
// import { ITutor } from './Tutor';
// import { IStudent } from './Student';

export interface IChat extends Document {
  sender: mongoose.Types.ObjectId 
  receiver: mongoose.Types.ObjectId
  message: string;
  createdAt: Date;
  senderType:string
}

const chatSchema: Schema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, 
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true }, 
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  senderType: { type: String, enum: ['student', 'tutor'], required: true } 

});

const Chat = mongoose.model<IChat>('Chat', chatSchema);

export default Chat;
