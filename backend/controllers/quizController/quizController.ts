import { Request, Response, NextFunction } from "express";
import Quiz from "../../models/quizModel";
import mongoose from "mongoose";

export const postQuizTutor = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    try {
        // Get the courseId from the query parameters
        const courseId = req.query.courseId as string;
        console.log('courseId:', courseId);

        // Get questions from the request body
        const { questions } = req.body;
        console.log('questions:', questions);

        // Validate questions format
        if (!Array.isArray(questions) || questions.length <= 0) {
            return res.status(400).json({ message: 'Not found or Invalid format' });
        }

        for (const question of questions) {
            if (
                typeof question.question !== 'string' ||
                !Array.isArray(question.options) ||
                typeof question.totalMarks !== 'number' ||
                typeof question.correctAnswer !== 'number' ||
                question.options.length === 0
            ) {
                return res.status(400).send({ message: 'Invalid question format.' });
            }
        }

        // Create and save a single quiz document with all questions
        const quiz = new Quiz({
            courseId,
            questions
        });

        const savedQuiz = await quiz.save();

        // Return the saved quiz in the response
        res.status(201).json(savedQuiz);
    } catch (error) {
        console.error('Error posting quiz:', error);
        next(error); // Pass the error to the next middleware (usually error handler)
    }
};

export const postQuizResult = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    try {
        const courseId = req.query.courseId as string;

        // Fetch the quiz data based on courseId
        const quiz = await Quiz.findOne({ courseId }); // Adjust this query based on your schema
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found for the given courseId' });
        }

        const { selectedOptions, questions } = req.body;

        // Calculate correct answers and total marks
        let correctCount = 0;

        quiz.questions.forEach((question: any, index: number) => {
            const selectedOption = selectedOptions[index]?.option;
            const selectedOptionIndex = parseInt(selectedOption, 10);
            const correctAnswerIndex = question.correctAnswer;

            if (selectedOptionIndex === correctAnswerIndex) {
                correctCount++;
            }
        });

        const totalMarks = quiz.questions.reduce((acc: number, curr: any) => acc + curr.totalMarks, 0);

        console.log('Correct Count:', correctCount);
        console.log('Total Marks:', totalMarks);
        quiz.result = correctCount;
     
        await quiz.save()

        // Return the result to the client
        res.status(200).json({courseId, correctCount, totalMarks });
    } catch (error) {
        next(error);
    }
};


export const getQuizResult = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    try {
        const courseId = req.query.courseId as string;
        console.log('courseId:', courseId);

        // Find the quiz based on courseId
        const getQuiz = await Quiz.findOne({ courseId });

        // If no quiz is found or no result exists, send null
        if (!getQuiz || !getQuiz.result) {
            return res.status(200).json(null);  // Make sure to return here
        }

        // Calculate total marks
        const totalMarks = getQuiz.questions.reduce((acc: number, curr: any) => {
            return acc + curr.totalMarks;
        }, 0);

        console.log('Result:', getQuiz.result);
        console.log('Total Marks:', totalMarks);

        // Send the result and total marks
        res.status(200).json({ result: getQuiz.result, totalMarks });
    } catch (error) {
        console.log('Error:', error);
        next(error);  // Pass the error to the error handler
    }
};
``
