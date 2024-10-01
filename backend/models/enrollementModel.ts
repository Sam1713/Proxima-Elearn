import mongoose, { Document, ObjectId, Schema } from 'mongoose';

interface EnrollementTypes {
    studentId: ObjectId;
    courseId: ObjectId;
    payment_status: string;
    completed?: string[];
    isComplete: boolean;
    createdAt?: Date; 
    updatedAt?: Date; 
}

const enrollementSchema = new Schema<EnrollementTypes>(
    {
        studentId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Student",
        },
        courseId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Course',
        },
        payment_status: {
            type: String,
            required: true,
        },
        completed: {
            type: Array,
            required: true,
            default: [],
        },
        isComplete: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Enrollment = mongoose.model<EnrollementTypes>("Enrollment", enrollementSchema);
export default Enrollment;
