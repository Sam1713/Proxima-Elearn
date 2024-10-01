import React, { useEffect, useState } from 'react';
import courseImage from '../../assets/images/OIP (34).jpeg';
import { FaUniversalAccess, FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate, useParams } from 'react-router-dom';
import { setSingleCourse } from '../../redux/courses/courseSlice';
import useScrollRestoration from '../customHooks/useScrollRestoration';
import EnrollModal from '../../modals/courseModal/EnrollModal';
import { clearFeed } from '../../redux/feed/feedSlice';
import api from '../API/Api'
import { setLoadingClose,setLoading, signout } from '../../redux/student/studentSlice';
import CourseDetailShimmer from '../shimmers/CourseDetailShimmer';
import { motion } from "framer-motion";
import { SlideLeft,  SlideUp } from '../../animation/animation';
import { isAxiosError } from 'axios';

const SingleCourseDetail:React.FC=()=> {
    useScrollRestoration()
    const {id}=useParams()
    const dispatch=useDispatch()
    const singleCourse=useSelector((state:RootState)=>state.course.singleCourse)
    
  const [currentPage, setCurrentPage] = useState(0);
  const[open,setOpen]=useState<boolean>(true)
  const[openLesson,setOpenLesson]=useState<boolean>(false)
  const[openAbout,setOpenAbout]=useState<boolean>(false)
  const[clicked,setClicked]=useState<string>('')
  const [openModal,setOpenModal]=useState<boolean>(false)

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const navigate=useNavigate()
 console.log('id',id)
 console.log('sing',singleCourse)
 const loading=useSelector((state:RootState)=>state.student.loading)
 useEffect(() => {
  const fetchCourseDetails = async () => {
    dispatch(setLoading())

    try {
      const response = await api.get(`/backend/auth/singleCourseDetail/${id}`, {
        headers: {
          'X-Token-Type': 'student',
        },
      });
      console.log('res',response)
      dispatch(setLoadingClose())
      dispatch(setSingleCourse(response.data.data));
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        const { status, data } = error.response;
    
        if (status === 403 && data.error === 'UserBlocked') {
          console.log('User is blocked');
          dispatch(signout());
          dispatch(clearFeed());
          localStorage.removeItem('access_token');
          navigate('/signin');
        } else {
          console.error('An error occurred:', error);
        }
      } else {
        console.error('An unknown error occurred:', error);
      }
    }
      
  };

  fetchCourseDetails();
}, [id, dispatch, navigate]);


  const handleOpen=()=>{
      setOpen(true)
      setClicked('overview')
      setOpenAbout(false)
      setOpenLesson(false)
  }
  const handleLessonOpen=()=>{
    setOpen(false)
    setClicked('about')
    setOpenAbout(true)
    setOpenLesson(false)
  }
  const handleAboutOpen=()=>{
    setOpen(false)
    setClicked('lessons')
      setOpenAbout(false)
      setOpenLesson(true)
  }

  const itemsPerPage = 4;
  const totalItems = 5; 

  const handleNext = () => {
    if (currentPage < Math.ceil(totalItems / itemsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const truncatedBio = singleCourse?.tutorDetails?.bio?.slice(0, 120) || '';
 
  const toggleBio = () => {
    setIsExpanded(!isExpanded);
  };
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const recommendedCourses = Array(5).fill(null).map((_, index) => ({
    id: index,
    title: 'AWS Certified Solutions Architect',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    image: courseImage
  }));

  const paginatedCourses = recommendedCourses.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  
   console.log('dsf',singleCourse?.lessons?.split('1'))

   const handleEnrollOpen=()=>{
       setOpenModal(true)
   }
   const handleEnrollClose=()=>{
    setOpenModal(false)
   }
   if (loading) {
    console.log('sdfsdfsdfiretert')
    return(
      <>
      <CourseDetailShimmer/>
      </>
    )
    
    // or any loading spinner or placeholder
  }
  return (
    <div className='bg-custom-gradient py-16 '>

      {/* Course Banner */}
      <div className='md:relative h-[35vh] md:h-[60vh] text-white'>
        <motion.img
          initial={{opacity:0,scale:0.5}}
          whileInView={{opacity:1,scale:1}}
          transition={{type:"spring",stiffness:50,delay:0.2}}
        className='w-full md:h-[60vh] object-contain md:object-cover hidden md:block' src={singleCourse?.coverImageUrl} alt="Course Image" />
        <motion.div className='mt-[60%] md:mt-0 md:absolute bg-black rounded-xl right-[4%] md:transform -translate-y-1/2 p-5 shadow-lg' style={{ boxShadow: '0 8px 15px rgba(255, 255, 255, 0.6)' }}>
          <motion.img
             initial="hidden"
             whileInView={"visible"}
             variants={SlideUp(0.3)}
          className='md:w-60 mb-4 rounded-md border-2 border-gray-500' src={singleCourse?.coverImageUrl} alt="Course Thumbnail" />
          <p className='text-gray-300 mb-4 text-2xl font-bold'>{singleCourse?.price}</p>
          <div className='text-center bg-white bg-opacity-10 rounded-xl py-2 mb-4'>
            <button onClick={handleEnrollOpen} className='font-bold text-lg p-2 text-white animate-ping'>Enroll Now</button>
          </div>
          <hr className='border-gray-500 mb-4' />
          <div>
            <h1 className='text-lg font-light mb-3 font-poppins'>This Course includes</h1>
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='flex items-center space-x-2 mb-2'>
              <FaUniversalAccess className='text-lg text-green-400' />
              <span className='text-sm'>Money Back Guarantee</span>
            </motion.div>
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          
            className='flex items-center space-x-2'>
              <FaUniversalAccess className='text-lg text-green-400' />
              <span className='text-sm'>Lifetime Access</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className='bg-black bg-opacity-50 p-5 rounded-2xl'>
      <div className='bg-white bg-opacity-10 p-5  rounded-xl md:w-[70%] mx-[4%] md:'>
        <div className='flex justify-around gap-4 font-bold'>
          <motion.button
          initial="hidden"
          whileInView={"visible"}
          variants={SlideLeft(0.5)}
          onClick={handleOpen} className={`${clicked==='overview'? 'bg-white bg-opacity-50 text-black':'bg-black bg-opacity-60 text-white'}  p-3 w-[25%] md:w-[20%] rounded-xl`}>Overview</motion.button>
          <motion.button
          initial="hidden"
          whileInView={"visible"}
          variants={SlideLeft(0.6)}
          onClick={handleLessonOpen} className={`${clicked==='about'?'bg-white bg-opacity-50 text-black':'bg-black bg-opacity-60 text-white'}  p-3 w-[25%] md:w-[20%] rounded-xl`}>About</motion.button>
          <motion.button
          initial="hidden"
          whileInView={"visible"}
          variants={SlideLeft(0.7)}
          onClick={handleAboutOpen} className={`${clicked==='lessons'?'bg-white bg-opacity-50 text-black':'bg-black bg-opacity-60 text-white'}  p-3 w-[25%] md:w-[20%] rounded-xl`}>Learning</motion.button>
          <motion.button
          initial="hidden"
          whileInView={"visible"}
          variants={SlideLeft(0.8)}
          className='bg-black bg-opacity-60 text-white p-3 w-[25%] md:w-[20%] rounded-xl'>FAQ</motion.button>
        </div>
      </div>

      {/* Course Details */}
     
        <div className='md:w-[70%] mx-[4%]  mt-12 bg-white bg-opacity-10 p-6 rounded-xl shadow-lg text-white'>
        {open && (
            <>
        <div className='bg-black md:w-[30%] rounded-xl mx-auto text-center py-4 mb-6'>
          <h1 className='text-3xl font-bold text-white'>4 Out of 5</h1>
          <p className='text-sm text-gray-300'>Top Rating</p>
        </div>

        <div className='flex items-center gap-4 mb-6'>
          <img className='w-14 h-14 rounded-full border-2 border-white' src={courseImage} alt="Tutor" />
          <motion.div
           initial="hidden"
           whileInView={"visible"}
           variants={SlideLeft(0.2)}
          className='text-xl font-semibold text-white'>{singleCourse?.tutorDetails?.tutorname}</motion.div>
        </div>
        <div className='mb-6'>
      <motion.h1
       initial="hidden"
       whileInView={"visible"}
       variants={SlideUp(0.2)}
      
    className='text-md leading-7 font-poppins text-gray-200'>
        {/* Show either the truncated or full bio based on the state */}
        {isExpanded ? singleCourse?.tutorDetails?.bio : `${truncatedBio}...`}
      </motion.h1>

      {/* Button to toggle between 'See More' and 'See Less' */}
      <button 
        onClick={toggleBio} 
        className='text-blue-500 hover:underline mt-2'
      >
        {isExpanded ? 'See Less' : 'See More'}
      </button>
    </div>
     

        <div className='flex items-center mt-6 gap-4'>
          <img className='w-14 h-14 rounded-full border-2 border-white' src={courseImage} alt="Tutor" />
          <div className='text-xl font-semibold text-white'>TutorName</div>
        </div>

        <div className='mt-6'>
          <h1 className='text-lg text-gray-200'>
            Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...
          </h1>
        </div>
        </>
    )}
        {openAbout &&(
        <div className='mt-5'>
           <h1 className='text-2xl font-bold underline mb-4'>About Course</h1>
           <p className=' overflow-y-scroll h-[50vh] leading-relaxed font-thin'>{singleCourse?.AboutCourse}</p>
        </div>
        )}
        {
            openLesson && (
                <>   
          <h1 className='text-2xl underline font-bold '>Lessons</h1>
             <p className=' mt-5 h-[50vh] overflow-y-scroll'>{singleCourse?.lessons?.split("")}</p>
             </>
            )}
       
        

      </div>
      </div>
     
<div className='w-[100%] flex justify-center  md:items-start'>
      <h1 className='mt-20  text-2xl md:text-3xl underline font-extralight text-white'>Recommended Courses</h1>
      </div>
     

      <div className='flex flex-wrap items-start gap-10 m w-[100%] px-14 mx- mt-10'>
        {paginatedCourses.map(course => (
          <div key={course.id} className='bg-white w-full sm:w-[48%] md:w-[23%] lg:w-[22%] rounded-lg overflow-hidden p-4 shadow-2xl transition-transform transform hover:scale-105' style={{ boxShadow: '0 4px 8px rgba(150, 150, 150, 0.9)' }}>
            <img className='w-full h-40 object-cover rounded-t-lg' src={course.image} alt="Course" />
            <div className='p-4'>
              <p className='text-gray-800 text-md font-semibold mb-2'>Design</p>
              <h1 className='text-gray-900 text-xl font-bold mb-3'>{course.title}</h1>
              <p className='text-gray-700 text-sm font-light'>
                {course.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-end mx-20 mt-5 md:mb-6  md:'>
        <button onClick={handlePrev} className='bg-black bg-opacity-60 text-white p-3 rounded-xl'>
          <FaArrowCircleLeft />
        </button>
        <button onClick={handleNext} className='bg-black bg-opacity-60 text-white p-3 rounded-xl'>
          <FaArrowCircleRight />
        </button>
      </div>
      <EnrollModal isOpen={openModal} onClose={handleEnrollClose}/>
    </div>
  );
}

export default SingleCourseDetail;
