import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { isTutorApproved } from '../../redux/tutor/tutorSlice';
import api from '../API/Api'
const TutorWaiting:React.FC=()=> {
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const currentTutor = useSelector((state: RootState) => state.tutor.currentTutor);
  const tutorApproved=useSelector((state:RootState)=>state.tutor.tutorApproval)
  useEffect(()=>{
    const fetchTutorWait=async()=>{
      const response=await api.get('/backend/tutor/tutorwait',{
        headers: {
          'X-Token-Type':'tutor',
        }
      })
      console.log('res',response)
      dispatch(isTutorApproved(response.data))

    }
    fetchTutorWait()
  },[])
 
  const handleHome = async () => {
    try {
      const tutor_access_token = localStorage.getItem('tutor_access_token');
      console.log('token',tutor_access_token)
      if (tutor_access_token) {
        await api.get('/backend/tutor/tutorhome', {
          headers: {
            'X-Token-Type':'tutor'
          },
        });

        
        navigate('/tutorhome');
      } else {
        console.error('No access token found');
      }
    } catch (error) {
      console.error('Error fetching tutor home:', error);
    }
  };
  console.log('tut',tutorApproved)
  return (
    <div
      className='min-h-screen flex items-center justify-center bg-cover bg-center'
      style={{ backgroundImage: "url(https://wallpapercave.com/wp/wp2832043.jpg)" }}
    >
      <div className='bg-white bg-opacity-80 p-8 md:p-12 lg:p-16 rounded-lg shadow-xl transform transition-transform duration-500 hover:scale-105'>
        <div className='text-center'>
          {!tutorApproved ? (
            <>
              <h1 className='text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 animate-pulse'>
                Waiting for Approval
              </h1>
              <p className='text-base md:text-lg text-gray-700 mb-6'>
                Thank you for your patience!
                <br />
                Your request to access the profile is being reviewed by our admin team.
                <br />
                Please wait for approval before proceeding.
              </p>
              <p className='text-sm md:text-base text-gray-600'>
                Estimated Wait Time: 24-48 hours
                <br />
                Status: Pending Review
                <br />
                Please note:
                <br />
                - Our admin team will review your request and verify your information.
                <br />
                - You will receive an email notification once your request is approved or rejected.
                <br />
                - If approved, you will be able to access your profile and start using our platform.
                <br />
                Thank you for your understanding!
              </p>
            </>
          ) : (
            <>
              <p className='text-gray-600'>Congratulations {currentTutor?.tutorname}!</p>
              <p>Your request has been successfully processed. Now you can explore your journey.</p>
              <p>Welcome to Proxima-Elearn!</p>
              <button
                onClick={handleHome}
                className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg'
              >
                Go to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TutorWaiting;
