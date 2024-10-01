import React, { useEffect, useRef, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { FaChevronLeft, FaChevronRight, FaRupeeSign } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import api from '../API/Api';
import { IoIosSearch } from "react-icons/io";
import AnimatedText from '../../animation/AnimatedText';
import notFound from '../../assets/images/49342678_9214777.jpg';
import { setCategories, setLoading, setLoadingClose, setStudentCourses } from '../../redux/student/studentSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from "@material-tailwind/react";
import CourseShimmer from '../shimmers/CourseShimmer';
import {  SlideUp } from '../../animation/animation';
import {motion} from 'framer-motion'

function AllCourses() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [page,setPage]=useState<number>(1)
  const [totalPages,setTotalPages]=useState<number>(1)
  const limit:number=8
  const dispatch = useDispatch<AppDispatch>();
  const navigate=useNavigate()
  const loading=useSelector((state:RootState)=>state.student.loading)
  const allCourses = useSelector((state: RootState) => state.student.courses);
  const categories = useSelector((state: RootState) => state.student.categories);
  const searchRef = useRef<HTMLInputElement>(null);
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
        dispatch(setCategories(response.data.categories))
        setTotalPages(response.data.totalPages)
      
    } catch (error) {
      dispatch(setLoadingClose())

      console.error('Error fetching courses:', error);
    }
  };


  
  const fetchSearchResults=async()=>{
    const search = searchRef.current?.value || ''; 

    dispatch(setLoading())
    console.log('dsdfsdf')
    const response=await api.get('/backend/course/getSearchCourse',{
      headers:{
        'X-Token-Type':'student'
      },
      params: { q: search }
    })
    console.log('resp',response)
    dispatch(setLoadingClose())
    dispatch(setStudentCourses(response.data));

  }

  const fetchCategorySort=async(categoryValue:string)=>{
    console.log('ca',categoryValue)
    try{
      dispatch(setLoading())
       const response=await api.get('/backend/course/getCategorySort',{
        headers:{
          'X-Token-Type':'student'
        },
        params:{
          category:categoryValue
        }
       })
       dispatch(setStudentCourses(response.data))
       dispatch(setLoadingClose())
       console.log('resqa',response);
       
    }catch(error){
      console.log('er',error)
    }
  }

  
 
   const fetchCOurseBasedOnPrice=async(minPrice:number,maxPrice:number)=>{
    dispatch(setLoading())
     const response=await api.get('/backend/course/getPricedCourses',{
       headers:{
         'X-Token-Type':'student'
       },
       params:{
         minPrice:minPrice,
         maxPrice:maxPrice
       }
     })
     console.log('responsa',response)
     dispatch(setStudentCourses(response.data))
     dispatch(setLoadingClose())
   }
 
  const handleDropdownChange = (type:'category'|'price',setter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    
    const value = event.target.value;
    setter(value);
    
    let minPrice:number = 0;
    let maxPrice = Infinity;
    if (type === 'price') {
      setSelectedCategory('All')
    switch (value) {
      case 'Under $1000':
        maxPrice = 1000;
        break;
      case '$1000-$2000':
        minPrice = 1000;
        maxPrice = 2000;
        break;
      case '$2000-$4000':
        minPrice = 2000;
        maxPrice = 4000;
        break;
      case 'Over $4000':
        minPrice = 4000;
        break;
      default:
        break;
    }
    if(value=='All'){
      fetchAllCourses(1,limit)
      setSelectedFilter('All')
      setSelectedCategory('All')


    }
    fetchCOurseBasedOnPrice(minPrice, maxPrice);

  }else if (type === 'category') {
    setSelectedFilter('All')
    const categoryValue:string = value;
    
    if (categoryValue === 'All') {
      setSelectedCategory('All')

      fetchAllCourses(1,limit)
      setSelectedFilter('All')
    } else {
      fetchCategorySort(categoryValue);
      
    }
  }

  };

  const uniqueCategories: string[] = ['All', ...new Set(categories?.map(category => category.categoryName))];



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
    <div className='bg-custom-gradient min-h-screen p-8 py-24'>
      
      <div className='relative md:flex    gap-4 md:px-20 mb-8 md:w-full '>
        <div className=" md:absolute  md:mx-16 md:pl-[68%] flex mb-8">
          <input 
          ref={searchRef}
  className='md:relative  px-6 p-3 bg-custom-gradient text-white w-[100%]  rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ring-2 ring-blue-500'            type="text" 
            placeholder="Search courses..." 
          />
          <IoIosSearch onClick={()=>fetchSearchResults()} className='absolute text-gray-100 md:top-1/4 top-3 right-2 cursor-pointer  text-2xl' />
        </div>
        <div className='grid grid-cols-2 md:flex gap-4 w-[100%] mx-auto'>
        <div className='relative'>
  <select 
    value={selectedCategory}
    onChange={handleDropdownChange('category', setSelectedCategory)}
    className='bg-black md:w-full text-white border border-gray-300 rounded-lg py-2 px-4 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500'
  >
    {uniqueCategories.map((category) => (
      <option className='font-thin' key={category} value={category}>{category}</option>
    ))}
  </select>
  <IoMdArrowDropdown className='absolute md:right-2 right-1 top-1/2 transform -translate-y-1/2 text-gray-100' />
</div>
        
        {/* <div className='relative '>
          <select 
            value={selectedSort}
            className='bg-black w text-white  border border-gray-300 rounded-lg py-2 px-4 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Most Popular">Most Popular</option>
            <option value="Newest First">Newest First</option>
          </select>
          <IoMdArrowDropdown className='absolute md:right-2 right-1  top-1/2 transform -translate-y-1/2 text-gray-100' />
        </div> */}
        
        <div className='relative'>
          <select 
            value={selectedFilter}
            onChange={handleDropdownChange('price',setSelectedFilter)}
            className='bg-black  text-white border  border-gray-300 rounded-lg py-2 px-4 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value="All">All</option>
            <option value="Under $1000">Under 1000</option>
            <option value="$1000-$2000">1000-2000</option>
            <option value="$2000-$4000">2000-4000</option>
            <option value="Over $4000">Over 4000</option>
          </select>
          <IoMdArrowDropdown className='absolute md:right-2 right-10  top-1/2 transform -translate-y-1/2 text-gray-100' />
        </div>
      </div>
      
</div>
<h1 className='text-white text-3xl mb-8  font-protest text-center md:hidden underline '>All Courses</h1>

      
        <motion.div
   initial={{  y: -100, opacity: 0.2 }}
   whileInView={{ skew: 0, y: 0, opacity: 1 }}
   variants={SlideUp(0.5)}
      transition={{ duration: 0.5, ease: "easeInOut" }}

        className='bg-white bg-opacity-10 rounded-lg p-4  md:w-[90%] w-full md:mx-auto'>
          
          {allCourses && allCourses.length > 0 ? (
            
            <div className='md:grid md:grid-cols md:grid-cols-2 lg:grid-cols-4 gap-6 '>
              {allCourses.map((course) => (
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
{allCourses.length>0&&allCourses.length>=limit &&
<div className="flex justify-center items-center space-x-4 py-4">
  <Button
            onClick={handlePrev}
            disabled={page == 1}
            variant="gradient"
            className="flex  items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg shadow-lg hover:opacity-90 transition duration-300 ease-in-out" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}  >
    <FaChevronLeft className="mr-2" />
    Prev
  </Button>

  <span className="text-white text-lg font-medium font-poppins">
    {page}-{totalPages}
  </span>

  <Button
            onClick={handleNext}
            disabled={page == totalPages}
            variant="gradient"
            className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg shadow-lg hover:opacity-90 transition duration-300 ease-in-out"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}  >
    Next
    <FaChevronRight className="ml-2" />
  </Button>
</div>
}
    </div>
  );
}

export default AllCourses;

