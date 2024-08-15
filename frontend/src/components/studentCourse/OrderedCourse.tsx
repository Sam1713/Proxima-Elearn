import React, { useEffect } from 'react';
import orderImage from '../../assets/images/LeetCode_Sharing.png';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { orderedCourse } from '../../redux/courses/courseSlice';
import { useNavigate } from 'react-router-dom';

function OrderedCourse() {
    const orderedCourses=useSelector((state:RootState)=>state.course.orderedCourses)
    const dispatch=useDispatch()
    const navigate=useNavigate()
    useEffect(()=>{
        const token=localStorage.getItem('access_token')

        const getOrderedCourses=async()=>{
         const response=await axios.get('/backend/enroll/getOrderedCourses',{
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
         })
         console.log('res',response.data.enrolledCourses)
         if (Array.isArray(response.data.enrolledCourses)) {
          dispatch(orderedCourse(response.data.enrolledCourses));
         }
        
        }
        getOrderedCourses()
    },[])
    console.log('order',orderedCourses)
    if (!Array.isArray(orderedCourses)) {
      return <div>No courses ordered yet.</div>;
    }

    const handleNavigate=(id:string|undefined)=>{
   console.log('id',id)
   navigate(`/courseDetail/${id}`)
    }
  return (
    <div className='min-h-screen  bg-custom-gradient py-[80%] md:py-0  mx-10'>
        <h1 className='text-white text-4xl md:text-2xl md:my-5 font-extralight mb-4'>My Courses</h1>
      <div  className='grid grid-cols-1 md:grid-cols-3 gap-8 '>
        {orderedCourses.map((course) => (
          <div 
          onClick={()=>handleNavigate(course?.Courses?._id)}
            key={course?.Courses?._id} 
            className='w-[300px] bg-custom-gradient p-5 rounded-lg shadow-lg  transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl'
            style={{ boxShadow: '0 4px 15px rgba(255, 0, 0, 10)' }}
          >
            <div className='mb-4 overflow-hidden rounded-lg'>
              <img 
                src={course.Courses.coverImageUrl} 
                alt="Course" 
                className='w-full h-auto rounded-lg transition-transform duration-300 hover:scale-110'
              />
            </div>
            <div className='text-center'>
              <p className='text-xl font-semibold mb-2 text-gray-100'>{course?.Courses?.title}</p>
              <p className='text-gray-100'>{course?.Courses?.Tutors?.tutorname}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderedCourse;
