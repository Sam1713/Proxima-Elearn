import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { orderedCourse } from '../../redux/courses/courseSlice';
import { useNavigate } from 'react-router-dom';
import { setLoading, setLoadingClose, signout } from '../../redux/student/studentSlice';
import { clearFeed } from '../../redux/feed/feedSlice';
import api from '../API/Api'
import axios from 'axios';
import LoadingSpinner from '../../utils/LoadingSpinner';
const OrderedCourse:React.FC=()=> {
    const orderedCourses=useSelector((state:RootState)=>state.course.orderedCourses)
    const loading=useSelector((state:RootState)=>state.student.loading)
    const dispatch=useDispatch<AppDispatch>()
    const navigate=useNavigate()
    useEffect(()=>{

        const getOrderedCourses=async()=>{
          try{
            dispatch(setLoading())
         const response=await api.get('/backend/enroll/getOrderedCourses',{
          headers: {
            'X-Token-Type': 'student',
          },
         })
         console.log('res',response.data.enrolledCourses)
         dispatch(setLoadingClose())
         if (Array.isArray(response.data.enrolledCourses)) {
          dispatch(orderedCourse(response.data.enrolledCourses));
         }
          }catch (error) {
            dispatch(setLoadingClose())

            if (axios.isAxiosError(error)) {
              const { status, data } = error.response || {};
      
              if (status === 403 && data?.error === 'UserBlocked') {
                dispatch(signout());
                dispatch(clearFeed());
                alert(data.message); 
                localStorage.removeItem('access_token'); 
                navigate('/signin'); 
              } else {
                console.error('An error occurred:', error);
              }
            } else {
              console.error('An unexpected error occurred:', error);
            }
          }
        };
      
        getOrderedCourses();
      }, []);
    if (!Array.isArray(orderedCourses)) {
      return <div>No courses ordered yet.</div>;
    }

    const handleNavigate=(id:string|undefined)=>{
   console.log('id',id)
   navigate(`/courseDetail/${id}`)
    }

    if(loading){
      return(
        <>
        <LoadingSpinner/>
        </>
      )
    }
  return (
    <div className='min-h-screen  bg-custom-gradient py-[25%] md:py-0  mx-5'>
        <h1 className='text-white text-4xl md:text-2xl md:my-5 font-extralight mb-4'>My Courses</h1>
      <div  className='grid grid-cols-1 md:grid-cols-3 gap-8  '>
        {orderedCourses?.length>0?(
        orderedCourses.map((course) => (
          <div 
          onClick={()=>handleNavigate(course?.Courses?._id)}
            key={course?.Courses?._id} 
            className='w-[] cursor-pointer bg-custom-gradient p-5 rounded-lg shadow-lg  transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl'
            style={{ boxShadow: '0 4px 15px rgba(255, 0, 0, 10)' }}
          >
            <div className='mb-4 overflow-hidden rounded-lg'>
              <img 
                src={course.Courses.coverImageUrl} 
                alt="Course" 
                className='w-full h-auto rounded-lg transition-transform duration-300 hover:scale-110'
              />
            </div>
            <div className='text-left'>
              <p className='text-xl font-semibold mb-2 text-gray-100'>{course?.Courses?.title}</p>
              <p className='text-gray-100'>{course?.Courses?.Tutors?.tutorname}</p>
            </div>
          </div>
        ))
      ):(
        <p className='text-white text-center'>No courses available.</p>

      )} 
        
    
      </div>
      
    </div>
  );
}

export default OrderedCourse;
