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

  // useEffect(()=>{
  //   fetchQuizResult()
  // },[dispatch])

  // const fetchQuizResult=async()=>{
  //   try{
  //      const response=await api.get('/backend/quiz/getQuizResult',{
  //       headers:{
  //         'X-Token-Type':'student'
  //       },
  //          params:{
  //           courseId:id
  //          }
  //      })
  //      console.log('res',response)
  //      if (!response.data) {
  //       console.warn('No result or data found for this quiz.');
  //       dispatch(setResult({ result: null, totalMarks: 0 }));  // Set default values if result is null
  //       return;
  //   }
  //      const result=response.data.result
  //      const totalMarks=response.data.totalMarks
  //      dispatch(setResult({result,totalMarks}))
  //   }catch(error){
  //     console.log('err',error)
  //   }
  // }
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

  
  console.log('resVal',resultVal?.result)
  // const percentage: number = parseFloat(((resultVal?.result / resultVal?.totalMarks) * 100).toFixed(2));
  // console.log('p',percentage)
  // console.log('resultValTot',resultVal?.totalMarks)

 

  // useEffect(()=>{
  // fetchQuiz()
  // },[])

  // const fetchQuiz=async()=>{
  //   const response=await api.get('/backend/quiz/getQuiz',{
  //     headers:{
  //       'X-Token-Type':'student'
  //     }
  //   })
  //   console.log('res',response)
  // }
  console.log('resu',resultVal)
  return (
    <div className="bg-custom-gradient min-h-screen flex items-center justify-center">
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
      
           
            
      <QuizOpenModal isOpen={quizOpen} onClose={handleModalClose} quizDetails={quizDetails} id={id} fetchQuizResult={fetchQuizResult}/>
    </div>
  );
};

export default QuizPage;
