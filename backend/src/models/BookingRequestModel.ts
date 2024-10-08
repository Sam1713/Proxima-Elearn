import mongoose, { Schema, Document } from 'mongoose';

interface RequestType extends Document {
    name: string;
    email: string;
    purpose: string;
    description?: string;
    status: 'default'|'pending' | 'accepted' | 'rejected';
    courseId: mongoose.Types.ObjectId; // Reference to the course
    tutorId: mongoose.Types.ObjectId;  // Reference to the tutor
    studentId: mongoose.Types.ObjectId; // Reference to the student
    tutorResponse?: {
        responseTime: string;
        startingTime:string;
        endingTime:string;
        notes?: string;
    };
    callId?:string;
    createdAt?: Date;
    updatedAt?: Date;
}

const BookingSchema = new Schema<RequestType>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['default','pending', 'accepted','approved', 'rejected','completed'],
        default: 'default',
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course', 
        required: true,
    },
    tutorId: {
        type: Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true,
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    tutorResponse: {
        responseDate: {
            type:String,
        },
        startingTime: {
            type: String,
        },
        endingTime:{
            type:String
        },
       
        notes: {
            type: String,
        },
    },
    callId:{
        type:String
    }
}, {
    timestamps: true, 
});

const BookingModel = mongoose.model<RequestType>('Booking', BookingSchema);
export default BookingModel;
