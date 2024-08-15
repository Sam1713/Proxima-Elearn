import React, { useEffect, useState } from 'react';
import courseVideo from '../../assets/images/LeetCode_Sharing.png';
import tutorImage from '../../assets/images/OIP (28).jpeg';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import tutorImage1 from '../../assets/images/OIP (34).jpeg';
import courseVideo1 from '../../assets/images/certificate-vector.jpg';
import courseVideo2 from '../../assets/images/1175458.jpg';
import { FaLaptop } from "react-icons/fa";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCourses } from '../../redux/courses/courseSlice';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import useScrollRestoration from '../customHooks/useScrollRestoration';

function Courses() {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  useScrollRestoration()
  const coursesArray=useSelector((state:RootState)=>state.course.courses)
  const courses = [
    { id: 1, title: 'AWS Certified Solutions Architect', video: courseVideo, tutor: 'Lina', tutorImage: tutorImage },
    { id: 2, title: 'React Development Bootcamp', video: courseVideo1, tutor: 'John Doe', tutorImage: tutorImage1 },
    { id: 3, title: 'Python for Data Science', video: courseVideo2, tutor: 'Jane Smith', tutorImage: tutorImage },
    { id: 4, title: 'Machine Learning Fundamentals', video: courseVideo, tutor: 'Emily Davis', tutorImage: tutorImage },
    { id: 5, title: 'Web Development with Node.js', video: courseVideo, tutor: 'Michael Brown', tutorImage: tutorImage },
  ];
  console.log('courses',coursesArray)

   useEffect(()=>{
    const fetchCourses=async()=>{
       try{
        const response=await axios.get('/backend/auth/getAllCourses')
        console.log(response.data.courses)
        dispatch(setCourses(response.data.courses))
       }catch(error){
        console.log('err',error)
       }
    }
    fetchCourses()
   },[])
  const coursesPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const [showAll, setShowAll] = useState(false);
  const coursesToShow = showAll ? courses : courses.slice(0, 4);
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = courses.slice(startIndex, startIndex + coursesPerPage);
 
  const handleNavigate = (id: string) => {
    navigate(`/singleCourseDetail/${id}`);
  };
  return (
    <div className="min-h-screen text-white bg-custom-gradient p-16">
      <h1 className="text-2xl mt-5 text-white font-thin">Welcome back, Ready for your next lesson?</h1>

      {/* Courses List */}
      <div className="bg-white bg-opacity-5 rounded-2xl shadow-lg overflow-hidden mt-8">
        <div className="flex flex-wrap gap-6 justify-center p-4">
          {currentCourses.map((course) => (
            <div key={course.id} className="w-[30%] text-white rounded-2xl p-4 bg-black mb-4">
              <img className="w-full rounded-xl h-[20vh] object-cover" src={course.video} alt="Course Video Thumbnail" />
              <p className="text-lg font-semibold mt-4">{course.title}</p>
              <div className="flex items-center mt-2">
                <img className="w-10 h-10 rounded-full object-cover" src={course.tutorImage} alt={course.tutor} />
                <p className="ml-3 text-sm">{course.tutor}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Buttons */}
        <div className="flex justify-center gap-2 mt-4 mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            <IoIosArrowBack />
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>

      {/* Course Categories */}
      <div className="mt-16 w-full">
        <h1 className="text-2xl font-bold text-center mb-8">Choose your favorite course from top categories</h1>
        <div className="flex flex-wrap justify-center gap-8">
          {['Development', 'Design', 'Marketing', 'Business'].map((category, index) => (
            <div
              key={index}
              className='w-[22%] p-5 flex flex-col items-center bg-custom-gradient rounded-xl'
              style={{ boxShadow: '0 8px 18px rgba(25, 245, 235, 0.2)' }}
            >
              <div className='p-6 bg-white rounded-full shadow-lg'>
                <FaLaptop className='text-red-500 text-4xl' />
              </div>
              <h1 className='font-thin mt-2 text-center text-gray-100'>{category}</h1>
              <p className='text-center mt-3 text-gray-100'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Show All Courses */}
      
      <div className='mt-10 mx-5 w-full'>
      <h1 className='text-3xl underline'>All Courses Available</h1>
      <div className="flex flex-wrap gap-6 py-4">
        {coursesArray.map((course) => (
          <div onClick={()=>handleNavigate(course._id)} key={course._id} className="w-[23%] text-white rounded-2xl p-4 bg-black mb-4">
            <img className="w-full rounded-xl h-[20vh] object-cover" src={course.coverImageUrl} alt="Course Video Thumbnail" />
            <p className="text-lg font-semibold mt-4">{course.title}</p>
            <p className='mt-5 h-[25vh] overflow-hidden'>{course.description}</p>
            <div className="flex items-center mt-2">
              <img className="w-10 h-10 rounded-full object-cover" src={tutorImage} alt='' />
              <div className="ml-3">
                <p className="text-sm">{course.tutorDetails.tutorname}</p>
                <p className="mt-1 text-sm">{course.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => setShowAll(true)} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            See All
          </button>
        </div>
      )}
    </div>
</div>
  )
}

export default Courses;
