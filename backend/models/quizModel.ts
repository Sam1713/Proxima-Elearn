import mongoose, { ObjectId, Schema, model } from "mongoose";

interface QuizType {
    courseId: ObjectId;
    questions: {
        question: string;
        options: string[];
        correctAnswer: number;
        totalMarks: number;
    }[];
    result:number;

}

const quizSchema = new Schema<QuizType>({
    courseId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Course'
    },
    questions: [
        {
            question: {
                type: String,
                required: true,
            },
            options: {
                type: [String],
                required: true,
            },
            correctAnswer: {
                type: Number,
                required: true,
            },
            totalMarks: {
                type: Number,
                required: true,
            }
        }
    ],
    result:{
        type:Number
    },
   
});

const Quiz = model<QuizType>("Quiz", quizSchema);
export default Quiz;
