import React, { useEffect, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { FaChevronLeft, FaChevronRight, FaRupeeSign } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setCourses } from '../../redux/courses/courseSlice';
import api from '../API/Api';
import { IoIosSearch } from "react-icons/io";
import AnimatedText from '../../animation/AnimatedText';
import notFound from '../../assets/images/49342678_9214777.jpg';
import InfiniteScroll from 'react-infinite-scroll-component';
import { setLoading, setLoadingClose, setStudentCourses } from '../../redux/student/studentSlice';
import { useNavigate } from 'react-router-dom';
import { Button, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import { Card } from "@material-tailwind/react";
import CourseShimmer from '../shimmers/CourseShimmer';
import { SlideRight, SlideUp } from '../../animation/animation';
import {motion} from 'framer-motion'

function AllCourses() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Price: Low to High');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchValue, setSearchValue] = useState<string>('');
  const [page,setPage]=useState<number>(1)
  const [totalPages,setTotalPages]=useState<number>(1)
  const limit=4
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const loading=useSelector((state:RootState)=>state.student.loading)
  const allCourses = useSelector((state: RootState) => state.student.courses);
  const categories = useSelector((state: RootState) => state.admin.viewAllCategory);
  
  console.log('cat',categories)
  useEffect(() => {
    fetchAllCourses(page,limit);
  },[page,limit]);

  const fetchAllCourses = async (page: number,limit:number) => {
    try {
      dispatch(setLoading())
      const response = await api.get(`/backend/auth/getAllCourses`, {
        headers: {
          'X-Token-Type': 'student'
        },
        params:{
          page:page,
          limit:limit
        }
      });
console.log('res',response.data)
       dispatch(setLoadingClose())
        dispatch(setStudentCourses(response.data.courses));
        setTotalPages(response.data.totalPages)
      
    } catch (error) {
      dispatch(setLoadingClose())

      console.error('Error fetching courses:', error);
    }
  };

  const handleDropdownChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    setter(event.target.value);
  };

  const uniqueCategories = ['All', ...new Set(categories?.map(category => category.categoryName))];

  const filteredCourses = allCourses?.filter(course => {
    // Check category
    const matchesCategory = selectedCategory === "All" || course?.category === selectedCategory;

    // Check price filter
    const price = course?.price || 0;
    let matchesPriceRange = true;
    if (selectedFilter === "Under $1000" && price >= 1000) matchesPriceRange = false;
    if (selectedFilter === "$1000-$2000" && (price < 1000 || price > 2000)) matchesPriceRange = false;
    if (selectedFilter === "$2000-$4000" && (price < 2000 || price > 4000)) matchesPriceRange = false;
    if (selectedFilter === "Over $4000" && price <= 4000) matchesPriceRange = false;

    const lowercasedSearchValue = searchValue.toLowerCase();
    const matchesSearch = (course?.title?.toLowerCase().includes(lowercasedSearchValue) ||
                           course?.category?.toLowerCase().includes(lowercasedSearchValue));
  
    return matchesCategory && matchesPriceRange && matchesSearch;
  });

  const sortedCourses = filteredCourses?.sort((a, b) => {
    if (selectedSort === 'Price: Low to High') {
      return a.price - b.price;
    } else if (selectedSort === 'Price: High to Low') {
      return b.price - a.price;
    } else if (selectedSort === 'Most Popular') {
      return b.popularity - a.popularity; 
    } else if (selectedSort === 'Newest First') {
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    }
    return 0;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleNavigate=(id:string)=>{
    navigate(`/singleCourseDetail/${id}`)
  }

  const handleNext=()=>{
    setPage((prev)=>prev+1)
  }
  const handlePrev=()=>{
    setPage((prev)=>prev-1)
  }
  if (loading) {
    return (
      <>
      <CourseShimmer/>
      </>

    );
  }
  
  return (
    <div className='bg-custom-gradient min-h-screen p-8'>
      <h1 className='text-white text-3xl mb-8'>All Courses</h1>
      
      <div className='relative md:flex    gap-4 md:px-20 mb-8 md:w-full '>
        <div className=" md:absolute  md:mx-16 md:pl-[68%] flex mb-8">
          <input 
            onChange={handleChange} 
  className='md:relative  px-6 p-3 bg-custom-gradient text-white w-[100%]  rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ring-2 ring-blue-500'            type="text" 
            placeholder="Search courses..." 
          />
          <IoIosSearch className='absolute text-gray-100 md:top-1/4 top-3  text-2xl' />
        </div>
        <div className='grid grid-cols-2 md:flex gap-4 w-[100%] mx-auto'>
        <div className='relative     '>
          <select 
            value={selectedCategory}
            onChange={handleDropdownChange(setSelectedCategory)}
            className='bg-black  md:w-full  text-white border border-gray-300 rounded-lg py-2 px-4 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {uniqueCategories.map((category) => (
              <option className='font-thin' key={category} value={category}>{category}</option>
            ))}
          </select>
          <IoMdArrowDropdown className='absolute  md:right-2 right-1 top-1/2 transform -translate-y-1/2 text-gray-100' />
        </div>
        
        {/* Sort Dropdown */}
        <div className='relative '>
          <select 
            value={selectedSort}
            onChange={handleDropdownChange(setSelectedSort)}
            className='bg-black w text-white  border border-gray-300 rounded-lg py-2 px-4 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Most Popular">Most Popular</option>
            <option value="Newest First">Newest First</option>
          </select>
          <IoMdArrowDropdown className='absolute md:right-2 right-1  top-1/2 transform -translate-y-1/2 text-gray-100' />
        </div>
        
        {/* Filter Dropdown */}
        <div className='relative'>
          <select 
            value={selectedFilter}
            onChange={handleDropdownChange(setSelectedFilter)}
            className='bg-black  text-white border  border-gray-300 rounded-lg py-2 px-4 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value="All">All</option>
            <option value="Under $1000">Under $1000</option>
            <option value="$1000-$2000">$1000-$2000</option>
            <option value="$2000-$4000">$2000-$4000</option>
            <option value="Over $4000">Over $4000</option>
          </select>
          <IoMdArrowDropdown className='absolute md:right-2 right-10  top-1/2 transform -translate-y-1/2 text-gray-100' />
        </div>
      </div>
      
</div>
      
      {/* Course Listings */}
      
        <motion.div
   initial={{  y: -100, opacity: 0.2 }}
   whileInView={{ skew: 0, y: 0, opacity: 1 }}
   transition={{ duration: 0.5, ease: "easeInOut" }}
   variants={SlideUp(0.5)}

        className='bg-white bg-opacity-10 rounded-lg p-4  md:w-[90%] w-full md:mx-auto'>
          {sortedCourses && sortedCourses.length > 0 ? (
            <div className='md:grid md:grid-cols-1 grid-cols-2 lg:grid-cols-4 gap-6 '>
              {sortedCourses.map((course) => (
                <div 
                onClick={()=>handleNavigate(course._id)}
                  key={course._id} 
                  className='bg-black text-white rounded-2xl p-4 md:w-full w-[100%]  mt-10 md:mt-0 hover:shadow-2xl transition-shadow duration-300 cursor-pointer'
                  style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}
                >
                  <img className='w-full h-[20vh] object-cover rounded-2xl mb-4' src={course.coverImageUrl} alt={course.title} />
                  <h2 className='text-sm font-bold mb-2 h-[3vh] overflow-hidden'>{course.title}</h2>
                  <p className='text-sm text-gray-400 mb-2'>Category: {course?.category}</p>
                  <div className='flex justify-between items-center mt-2'>
                  <div className='relative'>
                    <p className='mx-5 text-xl font-bold mb-2'>{course.price}</p>
                    <div className='absolute top-1/4'>
                      <FaRupeeSign className='text-white' />
                    </div>
                    </div>
                                        <p className='text-xs text-gray-500'>{course.popularity} <span className='text-gray-400'>stars</span></p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center text-4xl w-full text-white min-h-[60vh]'>
              <AnimatedText text="No courses found" />
              <img className='w-[20%] h-22 rounded-xl  animate-bounce mt-20' src={notFound} alt="No courses found" />
            </div>
          )}
        </motion.div>
        ;

<div className="flex justify-center items-center space-x-4 py-4">
  <Button
  onClick={handlePrev}
  disabled={page==1}
    variant="gradient"
    className="flex  items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg shadow-lg hover:opacity-90 transition duration-300 ease-in-out"
  >
    <FaChevronLeft className="mr-2" />
    Prev
  </Button>

  <span className="text-white text-lg font-medium font-poppins">
    {page}-{totalPages}
  </span>

  <Button
  onClick={handleNext}
  disabled={page==totalPages}
    variant="gradient"
    className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg shadow-lg hover:opacity-90 transition duration-300 ease-in-out"
  >
    Next
    <FaChevronRight className="ml-2" />
  </Button>
</div>
    </div>
  );
}

export default AllCourses;
