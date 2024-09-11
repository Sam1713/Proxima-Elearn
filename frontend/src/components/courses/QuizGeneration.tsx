import { Button, Input } from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../API/Api'
import { useParams } from 'react-router-dom';
const QuizGeneration = () => {
    const [numQuestions, setNumQuestions] = useState<number>(0);
    const [questions, setQuestions] = useState<{question: string, options: string[], totalMarks: number, correctAnswer: number}[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<number>(1);
    const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ question?: string, options?: string, totalMarks?: string, correctAnswer?: string }[]>([]);
    const {id}=useParams()
    useEffect(() => {
        if (numQuestions > 0) {
            setQuestions(Array.from({ length: numQuestions }, () => ({
                question: '',
                options: ['', '', '', ''],
                totalMarks: 1,
                correctAnswer: 0
            })));
            console.log('num',questions)
            setErrors(Array.from({ length: numQuestions }, () => ({}))); // Initialize empty errors for each question
            // setCurrentQuestion(1); 
        }
    }, [numQuestions]);

    const handleNumQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 0) {
            setNumQuestions(value);
        }
    };

    const handleStartQuiz = () => {
        if (numQuestions > 0) {
            setIsQuizStarted(true);
        }
    };

    const validateCurrentQuestion = () => {
        const current = questions[currentQuestion - 1];
        const newErrors: any = {};

        if (!current.question.trim()) {
            newErrors.question = 'Question cannot be empty';
        }

        if (current.options.some(option => !option.trim())) {
            newErrors.options = 'All options must be filled';
        }

        if (current.totalMarks <= 0) {
            newErrors.totalMarks = 'Total marks must be greater than 0';
        }

        if (current.correctAnswer < 1 || current.correctAnswer > 4) {
            newErrors.correctAnswer = 'Correct answer must be between 1 and 4';
        }

        const updatedErrors = [...errors];
        updatedErrors[currentQuestion - 1] = newErrors;
        setErrors(updatedErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Handlers for navigating between questions
    const handleNextQuestion = () => {
        if (validateCurrentQuestion()) {
            if (currentQuestion < numQuestions) {
                setCurrentQuestion(prev => prev + 1);
            }
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestion - 1].question = e.target.value;
        setQuestions(updatedQuestions);
    };

    // Handler for updating option text
    const handleOptionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestion - 1].options[index] = e.target.value;
        setQuestions(updatedQuestions);
    };

    // Handler for updating total marks
    const handleTotalMarksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestion - 1].totalMarks = parseInt(e.target.value, 10);
        setQuestions(updatedQuestions);
    };

    // Handler for updating correct answer
    const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestion - 1].correctAnswer = parseInt(e.target.value, 10);
        setQuestions(updatedQuestions);
    };

    // Handler for submitting the quiz
    const handleSubmit = async() => {
        if (validateCurrentQuestion()) {
            console.log('Quiz submitted:', questions);
            Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to submit the form?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, submit it!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await api.post('/backend/quiz/postQuiz',{questions},{
                            headers:{
                                'X-Token-Type':'tutor'
                            },
                            params:{
                                courseId:id
                            }
                        }); 
                        console.log('res',response)
                        if (response.success) {
                            Swal.fire(
                                'Submitted!',
                                'Your quiz has been submitted successfully.',
                                'success'
                            );
                        }
                    } catch (error) {
                        Swal.fire(
                            'Error!',
                            'There was an error submitting your quiz. Please try again later.',
                            'error'
                        );
                    }
                }
            });
        }
    };
    
  
    return (
        <div className='w-[80%] mx-auto my-10 flex justify-center items-center min-h-screen'>
            <div className='shadow-lg bg-black rounded-lg p-8 w-full max-w-4xl'>
                <h1 className='text-gray-100 text-4xl font-bold mb-6 text-center'>Create Quiz</h1>

                {!isQuizStarted ? (
                    <div className='w-full max-w-lg h-[40vh]  mx-auto flex flex-col items-center'>
                        <div className='w-[80%] bg-gray-900 p-6 rounded-lg shadow-lg'>
                            <h2 className='text-2xl font-semibold text-gray-100 mb-4 text-center'>Quiz Setup</h2>
                            <div className='mb-4'>
                                <Input
                                    label='Number of Questions'
                                    type='number'
                                    floatingLabel={true}
                                    className='w-full bg-custom-gradient text-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200'
                                    value={numQuestions}
                                    onChange={handleNumQuestionsChange}
                                    labelProps={{
                                        className: 'text-gray-100 peer-placeholder-shown:text-gray-400 peer-focus:none transition-all',
                                    }}
                                    containerProps={{
                                        className: 'relative',
                                    }}
                                />
                            </div>

                            <Button
                                className='w-full py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300'
                                onClick={handleStartQuiz}
                            >
                                Start Quiz
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {numQuestions > 0 && (
                            <>
                                <div className='text-white text-center'>
                                   <span className='text-xl font-poppins text-gray-500'> Total questions Available -</span><span className='mx-5 font-bold text-xl'>{numQuestions}</span>
                                </div>

                                <div className='mb-6 text-lg font-medium text-left text-white'>
                                    Question {currentQuestion}
                                </div>

                                <div className='mb-6'>
                                    <Input
                                        label='Enter your question'
                                        type='text'
                                        floatingLabel={true}
                                        className='w-full bg-custom-gradient text-white px-6 py-3 rounded-lg shadow-lg focus:border-transparent transition ease-in-out duration-200'
                                        value={questions[currentQuestion - 1].question}
                                        onChange={handleQuestionChange}
                                        labelProps={{
                                            className: 'text-white peer-focus:text-white',
                                        }}
                                    />
                                    {errors[currentQuestion - 1]?.question && (
                                        <p className="text-red-500 text-sm">{errors[currentQuestion - 1].question}</p>
                                    )}
                                </div>

                                <div className='grid grid-cols-2 gap-6 mb-6'>
                                    {questions[currentQuestion - 1].options.map((option, index) => (
                                        <Input
                                            key={index}
                                            label={`Option ${index + 1}`}
                                            type='text'
                                            floatingLabel={true}
                                            className='w-full bg-custom-gradient text-white px-6 py-3 rounded-lg shadow-lg focus:border-transparent transition ease-in-out duration-200'
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e)}
                                            labelProps={{
                                                className: 'text-white peer-focus:text-white',
                                            }}
                                        />
                                    ))}
                                    {errors[currentQuestion - 1]?.options && (
                                        <p className="text-red-500 text-sm">{errors[currentQuestion - 1].options}</p>
                                    )}
                                </div>

                                <div className='mb-6'>
                                    <Input
                                        label='Total Marks'
                                        type='number'
                                        floatingLabel={true}
                                        className='w-full bg-custom-gradient text-white px-6 py-3 rounded-lg shadow-lg focus:border-transparent transition ease-in-out duration-200'
                                        value={questions[currentQuestion - 1].totalMarks}
                                        onChange={handleTotalMarksChange}
                                        labelProps={{
                                            className: 'text-white peer-focus:text-white',
                                        }}
                                    />
                                    {errors[currentQuestion - 1]?.totalMarks && (
                                        <p className="text-red-500 text-sm">{errors[currentQuestion - 1].totalMarks}</p>
                                    )}
                                </div>

                                <div className='mb-6'>
                                    <Input
                                        label='Correct Answer (Option 1 to 4)'
                                        type='number'
                                        floatingLabel={true}
                                        className='w-full bg-custom-gradient text-white px-6 py-3 rounded-lg shadow-lg focus:border-transparent transition ease-in-out duration-200'
                                        value={questions[currentQuestion - 1].correctAnswer}
                                        onChange={handleCorrectAnswerChange}
                                        labelProps={{
                                            className: 'text-white peer-focus:text-white',
                                        }}
                                    />
                                    {errors[currentQuestion - 1]?.correctAnswer && (
                                        <p className="text-red-500 text-sm">{errors[currentQuestion - 1].correctAnswer}</p>
                                    )}
                                </div>

                                <div className='flex justify-between'>
                                    <Button
                                        className={`py-3 px-6 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ${currentQuestion === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={handlePreviousQuestion}
                                        disabled={currentQuestion === 1}
                                    >
                                        Previous
                                    </Button>

                                    {currentQuestion < numQuestions ? (
                                        <Button
                                            className='py-3 px-6 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition duration-300'
                                            onClick={handleNextQuestion}
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        <Button
                                            className='py-3 px-6 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-300'
                                            onClick={handleSubmit}
                                        >
                                            Submit Quiz
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default QuizGeneration;
