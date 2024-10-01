import React, { useEffect, useRef, useState } from 'react';
import tutorImage from '../../assets/images/OIP (28).jpeg';

import { FaLaptop } from "react-icons/fa";
import api from '../API/Api'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import useScrollRestoration from '../customHooks/useScrollRestoration';
import { setCategories, setFullCourses, signout } from '../../redux/student/studentSlice';
import { clearFeed } from '../../redux/feed/feedSlice';
import { AxiosError } from 'axios';

const Courses:React.FC=()=> {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useScrollRestoration();
  const coursesArray = useSelector((state: RootState) => state.student.fullCourses);
  const allCategories = useSelector((state: RootState) => state.student.categories);
console.log('add',allCategories)
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages,setTotalPages]=useState<number>(1);
  const catLimit:number=4
  const [showAll, setShowAll] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(()=>{
    const video=videoRef.current
    if(video){
      console.log('statt')
      video.play()
    }
    return ()=>{
        if(video){
          console.log('stopped')
          video.pause()
          video.currentTime = 0;
        }
    }

  },[])

  useEffect(()=>{
    fetchAllCategories(currentPage,catLimit)
  },[currentPage,catLimit])
  const fetchAllCategories = async (currentPage: number, catLimit: number) => {
    try {
      const response = await api.get('/backend/auth/getAllCategories', {
        headers: {
          'X-Token-Type': 'student',
        },
        params: {
          page: currentPage,
          limit: catLimit,
        },
      });

      console.log('response', response.data);
      dispatch(setCategories(response.data.getAllCategories));
      console.log('page', response.data.totalPages);
      setTotalPages(response.data.totalPages);
      
    } catch (error) {
      handleFetchError(error as AxiosError | Error);
        }
  };

  const handleFetchError = (error: AxiosError | Error) => {
    if ((error as AxiosError).response) {
      const { status, data } = (error as AxiosError).response!;
      
      if (status === 403 && (data as { error: string }).error === 'UserBlocked') {
        dispatch(signout());
        dispatch(clearFeed());
        alert((data as { message: string }).message); // Cast data to expected structure
        localStorage.removeItem('access_token');
        navigate('/signin');
      } else {
        console.error('An error occurred:', (data as { message: string }).message || error.message);
      }
    } else {
      console.error('An error occurred:', error.message);
    }
  };
  
  useEffect(()=>{
    fetchAllCourses()
  },[])
  const fetchAllCourses=async()=>{
    const response=await api.get('/backend/auth/getAllCourses',{
      headers:{
        'X-Token-Type':'student'
      }
    })
    dispatch(setFullCourses(response.data.courses))
    console.log('rs',response)
  }

 
  const currentCourses = showAll ? coursesArray : coursesArray.slice(0, 4);

  const handleNavigate = (id: string) => {
    navigate(`/singleCourseDetail/${id}`);
  };


  

  const handleBackword=()=>{
    setCurrentPage((prev)=>prev-1)
  }
  
  const handleForward=()=>{
    setCurrentPage((prev)=>prev+1)
  }
  return (
      <div className="relative min-h-screen text-white">
        <video
                ref={videoRef}

          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          autoPlay
          muted
          loop
        >
          <source
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
    
        {/* Overlay for the gradient and content */}
        <div className="relative min-h-screen text-white bg-gradient-to-b from-black via-transparent to-black md:p-16 py-10">
          <div className="md:flex md:justify-between md:items-center mb-8 md:ml-0 ml-10">
            <h1 className="text-3xl font-light  md:mx-10  tracking-wide mt-10 font-protest  text-white">
              Welcome back,This is your Sample course Page
            </h1>
          </div>
    
          {/* Courses List */}
          <button
            onClick={() => navigate('/allCourses')}
            className="text-center md:float-end p-3 mt-3 w-[60%] mx-[20%] md:mx-0  md:w-auto md:mb-auto rounded-xl font-thin bg-gray-700  hover:bg-blue-500 transition duration-300 ease-in-out transform hover:scale-105 text-white shadow-lg"
          >
            Go to All Courses
          </button>
    
          {/* Course Categories */}
          <div className="mt-16 w-full relative">
            <h1 className="text-2xl font-bold mx-10 mb-8">
              Choose your favorite course from top categories
            </h1>
           
            <div className="flex flex-wrap justify-center p-8 md:p-0 gap-8">
              {allCategories.map((category, index) => (
                <div
                  key={index}
                  className="md:w-[22%] p-5 flex flex-col items-center bg-custom-gradient rounded-xl"
                  style={{ boxShadow: '0 8px 18px rgba(25, 245, 235, 0.2)' }}
                >
                  <div className="p-6 bg-white rounded-full shadow-lg">
                    <FaLaptop className="text-red-500 text-4xl" />
                  </div>
                  <h1 className="font-thin mt-2 text-center text-gray-100">
                    {category?.categoryName}
                  </h1>
                  <p className="text-center mt-3 text-gray-100">
                    {category?.catDescription}
                  </p>
                </div>
              ))}
            </div>
           
          </div>
          <div className='text-center mt-5  flex items-center justify-center gap-4'>
  {/* Backward Button */}
  <button 
    disabled={currentPage === 1} 
    onClick={handleBackword} 
    className="bg-black text-white p-2 rounded-full w-12 h-12 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    &lt;
  </button>

  {/* Current Page and Total Pages */}
  <h1 className='text-black text-lg font-semibold'>
    {currentPage} / {totalPages}
  </h1>

  <button 
    disabled={currentPage === totalPages} 
    onClick={handleForward} 
    className="bg-black text-white p-2 rounded-full w-12 h-12 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    &gt;
  </button>
</div>

    
          {/* Show All Courses */}
          <div className="mt-10 md:mx-5 w-full ">
            <h1 className="text-3xl underline text-black font-protest">All Courses Available</h1>
            <div className="md:flex md:flex-wrap grid grid-cols-2 gap-5 py-4 w-full">
              {currentCourses.map((course) => (
                <div
                  onClick={() => handleNavigate(course._id)}
                  key={course._id}
                  className="md:w-[23%] w-[100%] h-[25vh] md:h-[40vh] overflow-y-scroll md:overflow-hidden text-white rounded-2xl p-4 bg-black mb-4 cursor-pointer transition-transform transform hover:scale-105"
                >
                  <img
                    className="w-full rounded-xl md:h-[20vh] object-cover"
                    src={course.coverImageUrl}
                    alt="Course Video Thumbnail"
                  />
                  <p className="text-sm font-semibold mt-4">{course.title}</p>
                  <div className="flex items-center mt-2">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={tutorImage}
                      alt={course.tutorDetails.tutorname}
                    />
                    <div className="ml-3">
                      <p className="text-sm">{course.tutorDetails.tutorname}</p>
                      <p className="mt-1 text-sm">{course.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!showAll? (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAll(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  See All
                </button>
              </div>
            ):(
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAll(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  See Less
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
    
    
}

export default Courses;
