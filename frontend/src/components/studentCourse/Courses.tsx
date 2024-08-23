import React, { useEffect, useState } from 'react';
import courseVideo from '../../assets/images/LeetCode_Sharing.png';
import tutorImage from '../../assets/images/OIP (28).jpeg';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import tutorImage1 from '../../assets/images/OIP (34).jpeg';
import courseVideo1 from '../../assets/images/certificate-vector.jpg';
import courseVideo2 from '../../assets/images/1175458.jpg';
import { FaLaptop } from "react-icons/fa";
import api from '../API/Api'
import { useDispatch, useSelector } from 'react-redux';
import { setCourses } from '../../redux/courses/courseSlice';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import useScrollRestoration from '../customHooks/useScrollRestoration';
import { signout } from '../../redux/student/studentSlice';
import { clearFeed } from '../../redux/feed/feedSlice';

function Courses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useScrollRestoration();
  const coursesArray = useSelector((state: RootState) => state.course.courses);
  const allCategories = useSelector((state: RootState) => state.admin.viewAllCategory);
  
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 3;
  const totalPages = Math.ceil(coursesArray.length / coursesPerPage);
  const [showAll, setShowAll] = useState(false);

  const fetchCourses = async () => {
    console.log('dsfs')
    try {
      const response = await api.get('/backend/auth/getAllCourses', {
        headers: { 'X-Token-Type': 'student' },
      });
      console.log('res',response.data)
      dispatch(setCourses(response.data.courses));
    } catch (error) {
      handleFetchError(error);
    }
  };  

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleFetchError = (error: any) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 403 && data.error === 'UserBlocked') {
        dispatch(signout());
        dispatch(clearFeed());
        alert(data.message);
        localStorage.removeItem('access_token');
        navigate('/signin');
      } else {
        console.error('An error occurred:', error);
      }
    } else {
      console.error('An error occurred:', error);
    }
  };

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
  const currentCourses = coursesArray.slice(startIndex, startIndex + coursesPerPage);

  const handleNavigate = (id: string) => {
    navigate(`/singleCourseDetail/${id}`);
  };

  return (
    <div className="min-h-screen text-white bg-custom-gradient p-16">
      <div className='flex justify-between items-center mb-8'>
        <h1 className="text-3xl font-light tracking-wide text-white">Welcome back, ready for your next lesson?</h1>
       
      </div>

      {/* Courses List */}
      <div className="bg-white bg-opacity-5 rounded-2xl shadow-lg overflow-hidden w-[100%] mt-8">
        <div className="md:flex md:flex-wrap grid grid-cols-2 md:gap-6 gap-4 justify-start  md:justify-center p-3">
          {currentCourses.map((course) => (
            <div className="w-[100%]  md:w-[30%] text-white rounded-2xl p-4 bg-black mb-4 cursor-pointer transition-transform transform hover:scale-105" key={course._id} onClick={() => handleNavigate(course._id)} >
              <img className="w-full md:w-[100%] rounded-xl h-[10vh] md:h-[20vh] md:object-cover object-contain" src={course.coverImageUrl} alt="Course Video Thumbnail" />
              <p className="md:text-lg text-sm h-[5vh] md:h-0 overflow-hidden  font-semibold mt-4">{course.title}</p>
              <div className="flex items-center mt-2">
                <img className="w-10 h-10 rounded-full object-cover" src={tutorImage} alt={'s'} />
                <p className="ml-3 text-sm">{course.tutorDetails.tutorname}</p>
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
      <button 
          onClick={() => navigate('/allCourses')}
          className='text-center float-end p-3 mt-3 rounded-xl  font-thin bg-custom-gradient hover:bg-blue-500 transition duration-300 ease-in-out transform hover:scale-105 text-white shadow-lg'
        >
          Go to All Courses
        </button>
      {/* Course Categories */}
      <div className="mt-16 w-full">
        <h1 className="text-2xl font-bold text-center mb-8">Choose your favorite course from top categories</h1>
        <div className="flex flex-wrap justify-center gap-8">
          {allCategories.map((category, index) => (
            <div
              key={index}
              className='md:w-[22%] p-5 flex flex-col items-center bg-custom-gradient rounded-xl'
              style={{ boxShadow: '0 8px 18px rgba(25, 245, 235, 0.2)' }}
            >
              <div className='p-6 bg-white rounded-full shadow-lg'>
                <FaLaptop className='text-red-500 text-4xl' />
              </div>
              <h1 className='font-thin mt-2 text-center text-gray-100'>{category?.categoryName}</h1>
              <p className='text-center mt-3 text-gray-100'>{category?.catDescription}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Show All Courses */}
      <div className='mt-10 md:mx-5 w-full'>
        <h1 className='text-3xl underline'>All Courses Available</h1>
        <div className="md:flex md:flex-wrap grid grid-cols-2 gap-5 py-4 w-full">
          {coursesArray.map((course) => (
            <div onClick={() => handleNavigate(course._id)} key={course._id} className="md:w-[23%] w-[100%] h-[25vh] md:h-[40vh] overflow-y-scroll md:overflow-hidden text-white rounded-2xl p-4 bg-black mb-4 cursor-pointer transition-transform transform hover:scale-105">
              <img className="w-full rounded-xl md:h-[20vh] object-cover" src={course.coverImageUrl} alt="Course Video Thumbnail" />
              <p className="text-sm  font-semibold mt-4">{course.title}</p>
              <div className="flex items-center mt-2">
                <img className="w-10 h-10 rounded-full object-cover" src={tutorImage} alt={course.tutorDetails.tutorname} />
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
