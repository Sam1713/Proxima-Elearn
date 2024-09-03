import mongoose, { Schema, Document, ObjectId } from 'mongoose';

interface NotificationTypes extends Document {
    studentId?: ObjectId;
    tutorId?: ObjectId;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema: Schema<NotificationTypes> = new Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, 
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' },
    message: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now }, 
});

notificationSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Notification = mongoose.model<NotificationTypes>('Notification', notificationSchema);

export default Notification;
