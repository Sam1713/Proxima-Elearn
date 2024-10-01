import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Radio,
} from "@material-tailwind/react";

import { FaTrophy, FaFrown } from 'react-icons/fa'; // Import win/lose icons
import { useSelector } from "react-redux";
import generateCertificate from '../../components/studentCourse/Certificate'; // Import the function correctly

import Swal from "sweetalert2";
import api from '../../components/API/Api'
import { useLocation } from "react-router-dom";
import { RootState } from "../../redux/store";
interface Questions {
  question: string;
  options: string[];
  correctAnswer: number;
  totalMarks: number;
}

interface QuestionTypes {
  id: string;
  courseId: string;
  questions: Questions[];
}

interface QuizTypes {
  isOpen: boolean;
  onClose: () => void;
  quizDetails: QuestionTypes;
  id?:string;
  fetchQuizResult:()=>void
}

interface OptionState {
  index: number;
  option: string;
}

const QuizOpenModal: React.FC<QuizTypes> = ({ isOpen, onClose, quizDetails,id,fetchQuizResult }) => {
  const [isSecondModalOpen, setIsSecondModalOpen] = useState<boolean>(false); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [selectedOptions, setSelectedOptions] = useState<OptionState[]>([]); 
  const [score, setScore] = useState<number | null>(null); 
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [percentage, setPercentage] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const currentUser=useSelector((state:RootState)=>state.student.currentStudent)

  const location = useLocation();

  const { orderedCourseDetail } = location.state || {};


  const tutorName = orderedCourseDetail?.courseDetail?.tutorDetails?.tutorname;
  const courseName = orderedCourseDetail?.courseDetail?.title;
  useEffect(() => {
    const selectedForCurrentQuestion = selectedOptions.find(
      (opt) => opt.index === currentQuestionIndex
    );
    setIsOptionSelected(!!selectedForCurrentQuestion); 
  }, [currentQuestionIndex, selectedOptions]);
  const handleQuizAccept = () => {
    onClose();
    setIsSecondModalOpen(true);
    setCurrentQuestionIndex(0); 
    setSelectedOptions([]); 
    setScore(null); 
    setIsOptionSelected(false); 
  };


  const handleQuizClose = () => {
    setIsSecondModalOpen(false); 
    setCurrentQuestionIndex(0); 
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizDetails.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleOptions = (e: React.ChangeEvent<HTMLInputElement>, optionIndex: number) => {
    console.log('io',e.target.value)
    const selectedOption = optionIndex;
     console.log('sefkdsfs',selectedOptions)
    const updatedOptions = [...selectedOptions];
    console.log('upd',updatedOptions)
    updatedOptions[currentQuestionIndex] = { index: currentQuestionIndex, option: selectedOption.toString() };
    setSelectedOptions(updatedOptions);
  };
  console.log('se;',selectedOptions )

  const handleSubmit = async() => {

 
   
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Submit the Quiz?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, accept it!'
  });
  if(result.isConfirmed){
    try{
     const response=await api.post('/backend/quiz/quizResult',{selectedOptions,questions:quizDetails?.questions},{
         headers:{
          'X-Token-Type':'student'
         },
         params:{
          courseId:id
         }
     })
     console.log('res',response)
     const correctCount=response.data.correctCount
     const totalMarks=response.data.totalMarks
     const percentage=(correctCount/totalMarks)*100
     const courseId=response.data.courseId
      setScore(correctCount); 
      setPercentage(percentage)
  setShowResult(true);

    setIsSecondModalOpen(false);
    }catch(error){
      console.log('err',error)
    }
  }
  };
const username=currentUser?.username||'user'

  const handleDownloadCertificate = () => {
    if (courseName && tutorName) {
      generateCertificate(courseName, username);
    }
  };

  const currentQuestion = quizDetails?.questions[currentQuestionIndex];

  return (
    <>
      <Dialog
        open={isOpen}
        handler={onClose}
        className="w-[800px] h-auto bg-custom-gradient shadow-lg rounded-lg border-t-4 border-green-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        <DialogHeader className="text-3xl underline font-protest text-center text-green-500"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Quiz Instructions
        </DialogHeader>

        <DialogBody className="text-white px-8 py-6"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <p className="font-poppins text-sm  mb-6 text-black bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded-lg shadow-md">
  <span className="font-bold">Note: </span>If you successfully completed the quiz once, then no need to attend again.
</p>

          <p className="text-xl font-poppins font-semibold mb-4 text-gray-100">
            Welcome to the quiz! Here are the instructions:
          </p>
          <ul className="list-disc font-open list-inside text-gray-100 mb-6">
            <li className="mb-2">
              Total Number of Questions: <strong className="font-bold">{quizDetails?.questions.length}</strong>
            </li>
            <li className="mb-2">
              You need to answer at least <strong>7 questions correctly</strong> to pass.
            </li>
            <li className="mb-2">
              Once you complete the quiz, you will receive a <strong>certificate</strong>.
            </li>
            <li className="mb-2">Take your time and do your best!</li>
          </ul>
          <p className="text-gray-500 text-xl font-poppins font-medium">
            Are you ready to begin the quiz?
          </p>
        </DialogBody>
        <DialogFooter className="justify-center"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <Button
            variant="outlined"
            color="red"
            onClick={onClose}
            className="mr-2 px-6 py-2 text-sm font-bold border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleQuizAccept}
            className="px-6 py-2 text-sm font-bold bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition duration-300"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            Accept
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={isSecondModalOpen}
        handler={handleQuizClose}
        size="xxl"
        className="bg-custom-gradient flex flex-col justify-center items-center w-[900px] h-[600px] p-8"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        <DialogHeader className="text-3xl py-10 font-bold text-center mb-4"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Quiz Question {currentQuestionIndex + 1}
        </DialogHeader>
        <DialogBody className="w-[60%] flex flex-col justify-between flex-grow p-8 bg-gray-800 rounded-lg"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {currentQuestion && (
            <div className="flex flex-col gap-6">
              <p className="text-2xl text-center font-poppins font-semibold mb-6 text-white">
                {currentQuestion.question}
              </p>
              <div className="grid grid-cols-2 gap-8">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 rounded-lg border border-gray-600"
                  >
                    <Radio
                      id={`q${currentQuestionIndex}a${index}`}
                      name={`q${currentQuestionIndex}`}
                      value={(index + 1).toString()}
                      onChange={(e) => handleOptions(e, index + 1)}
                      className="text-lg font-poppins text-red-500"
                      checked={selectedOptions[currentQuestionIndex]?.option === (index + 1).toString()} 
                      onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                    />
                    <span className="ml-2 text-white font-poppins">
                      Option {String.fromCharCode(65 + index)}: {option}
                      
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="flex justify-between mt-6" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <Button
            variant="outlined"
            color="red"
            onClick={handleQuizClose}
            className="mr-2 px-6 py-2"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="mr-2 px-6 py-2"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            Previous
          </Button>
        
          {currentQuestionIndex === quizDetails.questions.length - 1 ?(
          <Button
              variant="gradient"
              color="green"
              onClick={handleSubmit} 
              className="px-6 py-2"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            Submit
          </Button>
          ):(
            <Button
                variant="gradient"
                color="green"
                onClick={handleNext}
                disabled={!isOptionSelected}
                className="mr-2 px-6 py-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            Next
          </Button>
          )}
        </DialogFooter>
      </Dialog>

      {showResult && (
        <Dialog open={true} handler={() => setShowResult(false)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <DialogHeader className="text-2xl font-bold text-center"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
  {percentage && percentage >= 70 ? (
    <div className="flex items-center justify-center text-green-500">
      <FaTrophy className="text-4xl mr-2" />
      <span>Congratulations! You have passed</span>
      <Button
                  onClick={handleDownloadCertificate}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ml-4" // Added margin-left for spacing
                 placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        Download Certificate
      </Button>
    </div>
  ) : (
    <div className="flex items-center justify-center text-red-500">
      <FaFrown className="text-4xl mr-2" />
      <span>Better luck next time!</span>
    </div>
  )}
</DialogHeader>
<DialogBody className="text-center"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
  <p className="text-xl mb-2">
    Your score is <strong>{score}</strong> out of <strong>{quizDetails.questions.reduce((acc, q) => acc + q.totalMarks, 0)}</strong>.
  </p>
  <p className="text-lg">
    Your percentage is <strong>{percentage?.toFixed(2)}%</strong>.
  </p>
</DialogBody>
<DialogFooter className="flex justify-center mt-4" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
  <Button
              variant="gradient"
              color={percentage && percentage >= 70 ? "green" : "red"}
              onClick={() => setShowResult(false)}
              className="px-6 py-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}  >
    Close
  </Button>
</DialogFooter>

        </Dialog>
      )}
    </>
  );
};

export default QuizOpenModal;
