import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { isTutorApproved } from '../../redux/tutor/tutorSlice'
import tutorhome from '../../assets/images/teacher-is-a-work-of-heart-2_452-430-min.png'
import { FaChalkboardTeacher } from "react-icons/fa";
import api from '../API/Api'
const TutorHome:React.FC=()=> {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchHome = async () => {
     
      try {
        const response = await api.get('/backend/tutor/tutorhome', {
          headers: {
            'X-Token-Type':'tutor'
          }
        })
        console.log('res', response)
        dispatch(isTutorApproved(response.data))
      } catch (error) {
        console.log(error)
      }
    }
    fetchHome()
  }, [dispatch])

  return (
    <div
      className='min-h-screen bg-cover bg-center flex flex-col items-center pt-16'
    >
      <h1 className="text-white text-3xl font-extrabold mb-10">Welcome Tutor</h1>
      <div className=' md:w-[85%] w-[90%] bg-custom-gradient rounded-3xl  md:flex items-center justify-between  px-4'>
        <div className='md:px-32 w-full  md:w-[50%] font-serif'>
          <h2 className='text-center md:mx-0 w-full md:w-[85%] text-2xl text-white font-bold'>High Quality Courses</h2>
          <p className='py-5 md:mx-0 mx-20 text-center md:text-left  text-white opacity-50'>Every day brings with it a fresh set of learning possibilities.</p>
          <button className='bg-white bg-opacity-40 float-right md:float-none p-3 rounded-xl hover:bg-custom-gradient hover:text-white'>Get Started</button>
          <button className='bg-white md:mx-5 bg-opacity-40 p-3  rounded-xl hover:bg-custom-gradient hover:text-white'>Go to Courses</button>
        </div>
        <div className='p-12 md:p-0 mx-30 ml-5 md:ml-0 md:mx-0 '>
          <img className='w-[90%] md:w-[100%]  md:h-[40vh] rounded-lg md:animate-bounce animate-pulse shadow-2xl' src={tutorhome} alt="Quality Courses" />
        </div>
      </div>
      <div className=' mt-5 md:w-[85%] w-[90%] bg-custom-gradient p-5 rounded-2xl shadow-2xl'>
        <div className='text-center'>
          <p className='text-white'>Practice Advice</p>
          <h1 className=' w-full text-4xl text-white font-bold'>Most Popular Courses</h1>
          <p className='px-10 md:mx-auto md:w-[50%] py-4 text-center text-white'>Problems trying to resolve the conflict between 
          the two major realms of Classical physics: Newtonian mechanics </p>
        </div>
        <div className='flex-wrap md:flex md:justify-between md:items-center md:px-12 py-6 bg-white bg-opacity-25 md:w-[70%] md:mx-auto rounded-lg shadow-2xl'>
          <div className='mx-auto md:mx-0 flex flex-col items-center md:w-1/3 w-[80%] md:p-4 p-3 bg-custom-gradient rounded-lg shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl duration-300'>
            <FaChalkboardTeacher className='text-4xl text-red-500 mb-4' />
            <div className='text-center'>
              <p className='text-xl font-semibold text-gray-100 mb-2'>Training Courses</p>
              <p className='text-sm text-gray-100 text-opacity-65'>The gradual accumulation and small-scale improvements.</p>
            </div>
          </div>
          <div className='mx-auto md:mx-0 flex my-3 flex-col items-center md:w-1/3 w-[80%] p-4 bg-custom-gradient rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-2xl duration-300'>
            <FaChalkboardTeacher className='text-4xl text-red-500 mb-4' />
            <div className='text-center'>
              <p className='text-xl font-semibold text-gray-100 mb-2'>Training Courses</p>
              <p className='text-sm text-gray-100 text-opacity-65'>The gradual accumulation and small-scale improvements.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className='mt-10 w-full bg-gray-800 text-white py-8'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
          <div className='text-center md:text-left mb-4 md:mb-0'>
            <h2 className='text-2xl font-bold'>Tutor Platform</h2>
            <p className='text-sm'>Empowering Tutors Worldwide</p>
          </div>
          <div className='text-center md:text-right'>
            <p className='text-sm'>&copy; 2024 Tutor Platform. All Rights Reserved.</p>
            <p className='text-sm'>Terms of Service | Privacy Policy</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TutorHome
