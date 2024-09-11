import mongoose, { Schema, Document, ObjectId } from 'mongoose';

interface NotificationTypes extends Document {
    studentId?: ObjectId;
    tutorId?: ObjectId;
    courseId?:ObjectId;
    global?:boolean;
    message: string;
    type: 'booking' | 'courses' | 'default';
    read:Boolean;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema: Schema<NotificationTypes> = new Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, 
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },

    global:{type:Boolean,default: false},
    message: { type: String, required: true }, 
    type: { type: String, enum: ['booking', 'courses', 'default'], default: 'default' },
    read:{type:Boolean,default:false}, 
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now }, 
});

// notificationSchema.pre('save', function(next) {
//     this.updatedAt = new Date();
//     next();
// });

const Notification = mongoose.model<NotificationTypes>('Notification', notificationSchema);

export default Notification;
