import { Request, Response, NextFunction } from "express";
import Quiz from "../../models/quizModel";
import mongoose from "mongoose";

export const postQuizTutor = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    try {
        const courseId = req.query.courseId as string;
        console.log('courseId:', courseId);

        const { questions } = req.body;
        console.log('questions:', questions);

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

        const quiz = new Quiz({
            courseId,
            questions
        });

        const savedQuiz = await quiz.save();

        res.status(201).json(savedQuiz);
    } catch (error) {
        console.error('Error posting quiz:', error);
        next(error); 
    }
};

export const postQuizResult = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    try {
        const courseId = req.query.courseId as string;

        const quiz = await Quiz.findOne({ courseId }); 
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found for the given courseId' });
        }

        const { selectedOptions, questions } = req.body;

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
        

        res.status(200).json({courseId, correctCount, totalMarks });
    } catch (error) {
        next(error);
    }
};


export const getQuizResult = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    try {
        const courseId = req.query.courseId as string;
        console.log('courseId:', courseId);

        const getQuiz = await Quiz.findOne({ courseId });

        if (!getQuiz || !getQuiz.result) {
            return res.status(200).json(null);  
        }

        const totalMarks = getQuiz.questions.reduce((acc: number, curr: any) => {
            return acc + curr.totalMarks;
        }, 0);

        console.log('Result:', getQuiz.result);
        console.log('Total Marks:', totalMarks);

        res.status(200).json({ result: getQuiz.result, totalMarks });
    } catch (error) {
        console.log('Error:', error);
        next(error);  
    }
};
``


export const getQuizTutor = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const courseId = req.query.courseId as string;
        console.log('courseId from query:', courseId);
        
        const getQuiz = await Quiz.findOne({ courseId, isDelete: false }).sort({ createdAt: -1 });
        console.log('dsf')
        // if (!getQuiz) {
        //     return res.status(404).json({ message: 'Quiz not found for this course' });
        // }

        console.log('quiz', getQuiz);

        res.status(200).json(getQuiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'An error occurred while fetching the quiz', error });
    }
};

export const deleteQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseId = req.query.courseId as string;
  
      if (!courseId) {
        res.status(400).json({ message: 'Course ID is required' });
        return;
      }
  
      // Find the quiz by courseId
      const quiz = await Quiz.findOne({ courseId });
  
      if (!quiz) {
        res.status(404).json({ message: 'No quiz found for this course' });
        return;
      }
  
      quiz.isDelete = true;
      
      await quiz.save();
  
      console.log('Quiz marked as deleted:', quiz);
  
      res.status(200).json({ message: 'Quiz successfully marked as deleted', quiz });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ message: 'Server error. Could not delete the quiz' });
    }
  };