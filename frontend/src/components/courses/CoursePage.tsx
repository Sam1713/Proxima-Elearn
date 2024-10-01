import React, { useEffect, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import AnimatedText from '../../animation/AnimatedText'; // Adjust path as needed
import courseImage from '../../assets/images/pablo-blockchain-courses.png'
import AddCourseModal from '../../modals/courseModal/AddCourseModal';
import api from '../API/Api'
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '../../redux/student/studentSlice';
import { RootState } from '../../redux/store';
import { setTutorCategories } from '../../redux/tutor/tutorSlice';
const  CoursePage:React.FC=()=> {
    const[courseOpen,setCourseOpen]=useState<boolean>(false)
    const dispatch=useDispatch()
    const handleCourse=()=>{
        setCourseOpen(true)
    }
    const handleCourseClose=()=>{
        setCourseOpen(false)
    }
  const floatAnimation = useSpring({
    from: { transform: 'translateY(20px) ' },
    to: { transform: 'translateY(-20px)' },
    config: { duration: 3000 },
    loop: { reverse: true },
  });

  // Background color animation with react-spring
  const colorAnimation = useSpring({
    from: { backgroundColor: '#2c3e50' }, // Dark blueish-black
    to: [
      { backgroundColor: '#f39c12' }, // Vivid orange (yellowish)
      { backgroundColor: '#c0392b' }, // Strong red
      { backgroundColor: '#e74c3c' }, // Bright red
      { backgroundColor: '#2c3e50' }  // Loop back to the start color
    ],
    config: { duration: 8000 },
    loop: { reverse: true },
  });

  // Image scale and rotation animation
  const imageAnimation = useSpring({
    from: { transform: 'scale(1) rotate(0deg)' },
    to: { transform: 'scale(1.1) rotate(10deg)' },
    config: { duration: 3000 },
    loop: { reverse: true },
  });
 
useEffect(()=>{
  fetchCategory()
},[])

const fetchCategory=async()=>{
  const response=await api.get('/backend/course/getCategory',{
    headers:{
      'X-Token-Type':'tutor'
    }
  })
  dispatch(setTutorCategories(response.data))
  console.log('resaf',response.data)
}
const category=useSelector((state:RootState)=>state.tutor.allCategories)
console.log('cat',category)
  return (
    <div className='text-white min-h-screen flex flex-col w-[100%] items-center justify-center p-8'>
      {/* Animated background color and floating wrapper */}
      <animated.div
        style={{
          ...floatAnimation,
          ...colorAnimation,
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          maxWidth: '900px',
          width: '100%',
          textAlign: 'center',
          backgroundSize: '200% 200%', // Ensures the background color animation is smooth
        }}
        className='flex shadow-2xl flex-col space-y-8'
      >
        {/* Animated image */}
        <animated.img
          src={courseImage} // Replace with your image URL
          alt='Course'
          style={{
            ...imageAnimation,
            marginBottom: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          }}
          className='w-full max-w-[200px] mx-auto'
        />

        <AnimatedText text="Welcome to the Course Page. Here, you can find a variety of courses that cater to your learning needs." />
        <AnimatedText text="Explore different topics, learn new skills, and enhance your knowledge with our curated courses." />
        <AnimatedText text="Feel free to browse through the offerings and enroll in courses that pique your interest." />
      </animated.div>

      <button
      onClick={handleCourse}
        className='mt-8 bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300'
      >
        Add Course
      </button>
      <AddCourseModal isOpen={courseOpen} onClose={handleCourseClose}/>
    </div>
  );
}

export default CoursePage;
