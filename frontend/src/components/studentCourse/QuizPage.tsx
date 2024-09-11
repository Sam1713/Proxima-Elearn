import { Button } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import QuizOpenModal from '../../modals/quizModal/QuizOpenModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import generateCertificate from './Certificate'; // Import the function correctly
import { setRemoveQuiz, setResult } from '../../redux/student/studentSlice';
import api from '../../components/API/Api'
const QuizPage = () => {
  const getResult = useSelector((state: RootState) => state.student.quizResult);
  const dispatch=useDispatch()

  useEffect(()=>{
    fetchQuizResult()
  },[dispatch])

  const fetchQuizResult=async()=>{
    try{
       const response=await api.get('/backend/quiz/getQuizResult',{
        headers:{
          'X-Token-Type':'student'
        },
           params:{
            courseId:id
           }
       })
       console.log('res',response)
       if (!response.data) {
        console.warn('No result or data found for this quiz.');
        dispatch(setResult({ result: null, totalMarks: 0 }));  // Set default values if result is null
        return;
    }
       const result=response.data.result
       const totalMarks=response.data.totalMarks
       dispatch(setResult({result,totalMarks}))
    }catch(error){
      console.log('err',error)
    }
  }
  const [quizOpen, setQuizOpen] = useState<boolean>(false);
  const { id } = useParams();
  const location = useLocation();
  const { quizDetails, orderedCourseDetail } = location.state || {};
  const navigate = useNavigate();
  const currentUser=useSelector((state:RootState)=>state.student.currentStudent)
  console.log('order', orderedCourseDetail?.courseDetail?.tutorDetails?.tutorname);
  const tutorName = orderedCourseDetail?.courseDetail?.tutorDetails?.tutorname;
  const courseName = orderedCourseDetail?.courseDetail?.title;
  const resultVal=useSelector((state:RootState)=>state.student.resultQuiz)
  const handleModal = () => {
    setQuizOpen(true);
  };

  const handleModalClose = () => {
    setQuizOpen(false);
  };

  const handleDownloadCertificate = () => {
    if (courseName && tutorName) {
      generateCertificate(courseName, currentUser?.username);
    }
  };
  console.log('resVal',resultVal?.result)
  const percentage: number = parseFloat(((resultVal?.result / resultVal?.totalMarks) * 100).toFixed(2));
  console.log('p',percentage)
  console.log('resultValTot',resultVal?.totalMarks)

  const handleRemove=()=>{
    dispatch(setRemoveQuiz())
  }
  console.log('resu',resultVal)
  return (
    <div className="bg-custom-gradient min-h-screen flex items-center justify-center">
      {resultVal?.result==null ? (
        <div className="text-center bg-gray-900 p-8 shadow-2xl rounded-xl">
          <h1 className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text font-protest text-4xl font-bold mb-8">
            Do you wanna start the Quiz?
          </h1>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate(`/courseDetail/${id}`)} className="bg-custom-gradient">
              No
            </Button>
            <Button onClick={handleModal} className="bg-custom-gradient">
              YES
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 p-10 rounded-xl shadow-2xl w-[70%] mx-auto text-center">
          <h1 className="text-white font-protest text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Quiz Results
          </h1>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg">
            <p className="text-white font-poppins text-3xl mb-4">
              {percentage < 70 ? 'Sorry, You failed... Try Again' : '🎉 Congratulations!'}
            </p>
            <p className="text-white text-2xl mb-2">
              Correct Answers: <span className="font-semibold">{resultVal?.result}</span>
            </p>
            <p className="text-white text-2xl mb-6">
              Percentage: <span className="font-semibold">{percentage}%</span>
            </p>
            <button onClick={handleRemove}>
              remove quiz
            </button>
            {percentage > 70 ? (
              <Button
                onClick={handleDownloadCertificate}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Download Certificate
              </Button>
            ) : (
              <Button
                onClick={handleModal}
                className="bg-blue-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      )}
      <QuizOpenModal isOpen={quizOpen} onClose={handleModalClose} quizDetails={quizDetails} id={id} fetchQuizResult={fetchQuizResult}/>
    </div>
  );
};

export default QuizPage;
