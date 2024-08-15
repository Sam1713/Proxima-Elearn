import React, { useState } from 'react'
import { EditTutor } from '../../types/modalTypes/EditModat'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { FaRupeeSign } from "react-icons/fa";
import { FaCheckCircle } from 'react-icons/fa';
import { IoCloseOutline } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaSpinner } from 'react-icons/fa'; // Import spinner icon


const EnrollModal:React.FC<EditTutor>=({isOpen,onClose})=>{
    const navigate = useNavigate(); // Import useHistory from react-router-dom
    const [loading,setLoading]=useState<boolean>(false)

  const singleCourse=useSelector((state:RootState)=>state.course.singleCourse)
  const id=singleCourse?._id
  const handleCheckout=async()=>{
    const token=localStorage.getItem('access_token')

      try{
        setLoading(true)
          const response=await axios.post('/backend/enroll/checkout',{courseId:id},{
            headers: {
                'Authorization': `Bearer ${token}`
              },
              withCredentials: true,
          })
          console.log('res',response)
          setLoading(false)
          if (response.data.success) {
    
    const { student, order, title } = response.data;
      navigate('/checkout', { state: { course: singleCourse, student, order, title } });

          } else {
            alert('Failed to create order. Please try again.');
          }      }catch(error){
        console.log(error)
      }
  }
  if(!isOpen) return null
  return (
    <div className='fixed inset-0 flex  justify-center items-center bg-white bg-opacity-50'>
     <div className='relative w-[60%] h-[70vh] p-4 rounded-2xl bg-custom-gradient'>
        <button onClick={onClose} className='absolute right-0 text-3xl p-1 top-0'><IoCloseOutline className='text-white' />
        </button>
         <div>
          <p className='text-2xl font-extralight text-center text-white underline'>{singleCourse?.title}</p>
          <FaRupeeSign className='left-1/3 mt-[2%] mx-[9%] absolute text-white text-2xl fonr-bold h-8' />

          <p className='relative font-extralight text-white text-4xl text-center mx-[2%] mt-[1%]'>{singleCourse?.price}</p>
          <div className='mt-10 mx-20'>
          <p className='font-bold text-lg text-white'>Your Course fee includes:</p>
          <div className='relative mt-5'>
          <span className='relative  mx-7 text-white'>Access to course materials, including videos, readings, and discussion forums</span>

          <FaCheckCircle className='text-blue-700 absolute top-1/4 ' />
          </div>
          <div className='relative mt-5'>
          <span className='relative  mx-7 text-white'>Access to graded assignments</span>

          <FaCheckCircle className='text-blue-700 absolute top-1/4 ' />
          </div>
          <div className='relative mt-5'>
          <span className='relative  mx-7 text-white'>Final grade at the end of the course</span>

          <FaCheckCircle className='text-blue-700 absolute top-1/4 ' />
          </div>
          <div className='relative mt-5'>
          <span className='relative  mx-7 text-white'>Shareable Course Certificate</span>

          <FaCheckCircle className='text-blue-700 absolute top-1/4 ' />
          </div>
          </div>
          <div className='w-1/3 p-4 bg-white bg-opacity-15 mx-auto mt-10 rounded-xl'>
          <button 
              onClick={handleCheckout} 
              className='text-2xl font-thin text-white text-center w-[90%] flex justify-center items-center'
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className='animate-spin mr-2' /> // Display spinner icon
              ) : (
                'Continue to Enroll'
              )}
            </button>         </div>
         </div>
       
     </div>
      
    </div>
  )
}

export default EnrollModal
