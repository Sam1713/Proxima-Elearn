import React, { useEffect, useState } from 'react';
import { IoIosStar } from "react-icons/io";
import { GrCertificate } from "react-icons/gr";
import { FaLaptop, FaWpbeginner, FaPlus } from "react-icons/fa";
import tutorImage from '../../assets/images/OIP (30).jpeg'
import AnimatedText from '../../animation/AnimatedText';
import {  useNavigate, useParams } from 'react-router-dom';
import { setOrderedCourseDetails } from '../../redux/courses/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import VideoPlayer from '../../utils/VideoPlayer';
import { setLoading, setLoadingClose, setStudentQuizDetails } from '../../redux/student/studentSlice';
import OrderCOurseShimmer from '../shimmers/OrderCOurseShimmer';
import {motion} from 'framer-motion'
import { SlideLeft, SlideRight, SlideUp } from '../../animation/animation';
import CountUp from 'react-countup';
import api from '../API/Api'


const CourseDetails:React.FC=()=> {
  const {id}=useParams() 

  const dispatch=useDispatch()
  const orderedCourseDetail=useSelector((state:RootState)=>state.course.orderedCourseDetail)
  console.log('ors',orderedCourseDetail)

  const [courseOpen,setCourseOpen]=useState<boolean>(false)
  const navigate=useNavigate()
  const handleOpen=()=>{
    setCourseOpen(!courseOpen)
  }
  const quizDetails=useSelector((state:RootState)=>state.student.StudentQuizDetails)
console.log('quiz',quizDetails)
const loading=useSelector((state:RootState)=>state.student.loading)
  
 

  const videoLength=orderedCourseDetail?.courseDetail?.videos?.length
  useEffect(()=>{
      dispatch(setLoading())
     const getOrderedCourseDetail=async()=>{
        const response=await api.get(`/backend/enroll/getOrderedCourseDetail/${id}`,{
          headers: {
            'X-Token-Type':'student'
          }
        })
        console.log('res',response)
        dispatch(setLoadingClose())
        const { courseDetail, otherCourses,quizzes } = response.data;
const courseDetailData = courseDetail.Courses; 
const otherDetailData = otherCourses 
const studentquiz=quizzes

dispatch(setOrderedCourseDetails({ courseDetail: courseDetailData, otherCourses :otherDetailData}));
dispatch(setStudentQuizDetails(studentquiz))

      
      }
     getOrderedCourseDetail()
     
  },[dispatch,id])
  const sections = orderedCourseDetail?.courseDetail?.videos?.map((_, index) => `video${index + 1}`) || [];
    console.log('cover',orderedCourseDetail?.courseDetail?.coverImageUrl)
  console.log('single',orderedCourseDetail?.courseDetail?.category
  )
  console.log('otherCourses',orderedCourseDetail?.otherCourses[0]?.title)
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index:number|null) => {
    setOpenSection(openSection === index ? null : index);
  };
  const handleNavigate=(id:string)=>{
    navigate(`/singleCourseDetail/${id}`)
  }

  const handleVideoCall=(id:string)=>{
    console.log('id',id)
    navigate(`/booking/${id}`)
  }

  const handelQuiz=()=>{
    navigate(`/getQuiz/${id}`,{state:{quizDetails,orderedCourseDetail}})
  }


  if(loading){
    return(
    <>
    <OrderCOurseShimmer/>
    </>
    )
  }
  return (
    <div
    className='min-h-screen md:w-full py-16 bg-custom-gradient'>
      {orderedCourseDetail?.courseDetail== undefined ? (
    <div className="translate-y-[50%]">
      <div className='text-center m-auto'>
    <h1 className='text-white text-3xl font-bold mb-4 animate-pulse'>
      Please purchase the course
    </h1>
    <p className='text-gray-300 text-lg'>
      Unlock all the learning materials by enrolling in this course.
    </p>
    <button onClick={()=>{navigate('/courses')}} className='mt-6 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all'>
      Purchase Now
    </button>
    </div>
  </div> 
):(
  <>
      <div className='md:relative md:w-[95%] mx-auto p-[10%] bg-black bg-opacity-35 md:flex md:justify-between md:items-center rounded-2xl'>
        <div className='md:w-[50%]'>
          <p className='text-white bg-blue-900 p-1 mb-4 mt-2 md:mt-0 md:w-[30%] text-center rounded-lg'>
          <AnimatedText text="Most Subscribed" />
          </p>
          <h1 className=' font-protest  text-3xl md:mt-0 mt-5  w-[100%]'style={{
    background: 'linear-gradient(to right, #FF7E5F, #FFB89C)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }}>
          {orderedCourseDetail?.courseDetail?.title && (
            <AnimatedText text={orderedCourseDetail?.courseDetail?.title} />
)}
          </h1>
          <p className='text-white mt-3'>
            <AnimatedText text="Learn how to apply User Experience (UX) principles to your website designs, code a variety of sites, and increase sales!"/>
          </p>
          <div className='mt-3 relative'>
          <span><IoIosStar className='absolute text-yellow-500 ' /></span>

            <span className='text-white mx-5'><AnimatedText text="4.5 (2,540 Reviews)"/></span>
            <span className='text-white font-serif'>
              {orderedCourseDetail?.courseDetail?.tutorDetails?.tutorname&&(
               <AnimatedText text={orderedCourseDetail?.courseDetail?.tutorDetails?.tutorname}/>
  )}</span>
          </div>
        </div>
        <div>
         <motion.img
            initial={{opacity:0,scale:0.5}}
            whileInView={{opacity:1,scale:1}}
            transition={{type:"spring",stiffness:100,delay:0.2}}
            className='md:absolute md:w-[40%] md:top-1/4 md:my-[-5%] md:object-contain object-fit w-[80] h-[30vh] my-[10%]  md:mx-[5%] left-1/2 md:h-[55vh]  mx-auto'
            src={orderedCourseDetail?.courseDetail?.coverImageUrl}
            alt="Course"
            style={{
                 
                marginBottom: '40px',
                borderRadius: '10px',
                boxShadow: '0px 0px 255px rgba(0, 255, 255, 0.2)', // Cyan color with 0.9 opacity
              }}
          />
        </div>
      </div>

      <motion.div
       initial="hidden"
       whileInView={"visible"}
       variants={SlideUp(0.3)}
      className='flex justify-evenly items-center mt-10 rounded-xl mx-auto'>
        <div className='text-center text-white md:text-3xl'>
          <h1 className='font-extrabold'> <CountUp  
    end={quizDetails?.questions?.length || 0}  
          separator=','
        suffix='+'
        duration={5}
        enableScrollSpy={true}
        scrollSpyOnce={true}/>
      </h1>
          <p className='font-extralight font-poppins'>Total Assignments</p>
        </div>
        <div className='text-center text-white md:text-3xl'>
          <h1 className='font-extrabold'>
          <CountUp
        end={orderedCourseDetail?.courseDetail?.videos?.length}
        separator=','
        suffix='+'
        duration={5}
        enableScrollSpy={true}
        scrollSpyOnce={true}/>
          </h1>
          <p className='font-extralight font-poppins'>Total Videos</p>
        </div>
        <div className='text-center text-white md:text-3xl'>
          <h1 className='font-extrabold'>

          <CountUp
        end={orderedCourseDetail?.otherCourses?.length}
        separator=','
        suffix='+'
        duration={5}
        enableScrollSpy={true}
        scrollSpyOnce={true}/>
          </h1>
          <p className='font-extralight font-poppins'>Tutor Other Courses</p>
        </div>
      </motion.div>

      <div className='md:w-[80%]  text-white mx-auto  rounded-xl mt-10'>
        <motion.div
                        initial="hidden"
                        whileInView={"visible"}
                        variants={SlideLeft(0.5)}
        className='text-lg font-extralight flex flex-wrap justify-between items-center mx-auto px-4 md:px-[%] gap-4 bg-white bg-opacity-5 p-4 rounded-xl'>
          <motion.h1
            initial="hidden"
            whileInView={"visible"}
            variants={SlideLeft(0.7)}
          className='font-bold md:w-[15%] text-center'>About Course</motion.h1>
          <motion.h1
            initial="hidden"
            whileInView={"visible"}
            variants={SlideLeft(0.8)}
             className='font-bold md:w-[15%] text-center'>Course Content</motion.h1> 
          <motion.h1
            initial="hidden"
            whileInView={"visible"}
            variants={SlideLeft(0.8)} className='font-bold md:w-[15%] text-center'>About Publisher</motion.h1>
          <motion.h1
            initial="hidden"
            whileInView={"visible"}
            variants={SlideLeft(0.9)} className='font-bold md:w-[15%] text-center'>Success Stories</motion.h1>
          {/* <motion.button
           initial="hidden"
           whileInView={"visible"}
           variants={SlideRight(1)}
           onClick={() => handleVideoCall(id || 'defaultId')} className='w-full md:w-[15%] mt-4 md:mt-0 text-white py-2 rounded-lg text-center border-black border-2 hover:bg-custom-gradient'>
            Chat With Tutor
          </motion.button> */}
          <motion.button
           initial="hidden"
           whileInView={"visible"}
           variants={SlideRight(1.2)}
           onClick={() => handleVideoCall(id || 'defaultId')} className='w-full md:w-[15%] mt-4 md:mt-0 bg-blue-600 text-white py-2 rounded-lg text-center bg-custom-gradient'>
            Video Call
          </motion.button>
        </motion.div>
        <motion.div
          initial={{opacity:0,scale:0.5}}
          whileInView={{opacity:1,scale:1}}
          transition={{type:"spring",stiffness:50,delay:0.2}}
        className='mt-5 px-10 md:flex md:justify-between items-center'>
          <div className='md:w-[45%]'>
            <h1>About Course</h1>
            <p className='text-2xl font-bold'>
              Covers pretty much everything you need to know about <motion.span
              initial="hidden"
              whileInView={"visible"}
              variants={SlideRight(0.9)}
              className='text-3xl font-protest text-cyan-200'>{orderedCourseDetail?.courseDetail?.title}</motion.span>
            </p>
            <h1
            
            className='font-bold mt-10 text-xl'>Details:</h1>
            <p className='text-sm h-[40vh] overflow-y-scroll leading-7'>
{orderedCourseDetail?.courseDetail?.AboutCourse}            </p>
          
          </div>
          <div className='flex flex-col justify-between items-center py-4 space-y-8 p-4 bg-custom-gradient rounded-3xl mt-10 md:mt-0 md:mx-[-3%]'>
            <div className='w-[100%]'>
              <div className='flex items-center space-x-3'>
                <span className='bg-white rounded-xl p-3'>
                  <GrCertificate className='text-2xl text-blue-600' />
                </span>
                <div className='w-[100%]'>
                  <h1 className='text-lg font-semibold'>Authentic Certificate</h1>
                  <p className='text-sm'>Earn a Certificate upon completion</p>
                </div>
              </div>
            </div>
            <div className='w-[100%]'>
              <div className='flex items-center space-x-3'>
                <span className='bg-white p-4 rounded-xl'>
                  <FaLaptop className='text-xl text-blue-600' />
                </span>
                <div className='w-[100%]'>
                  <h1 className='text-lg font-semibold'>Online Classes</h1>
                  <p className='text-sm'>Start instantly and learn at your own pace</p>
                </div>
              </div>
            </div>
            <div className='w-[100%]'>
              <div className='flex items-center space-x-3'>
                <span className='bg-white p-4 rounded-xl'>
                  <FaWpbeginner className='text-xl text-blue-600' />
                </span>
                <div>
                  <h1 className='text-lg font-semibold'>Lifetime Accessibility</h1>
                  <p className='text-sm'>Set and maintain flexible deadlines.</p>
                </div>
              </div>
            </div>
            <div className='w-[100%]'>
              <div className='flex items-center space-x-3'>
                <span className='bg-white p-4 rounded-xl'>
                  <GrCertificate className='text-2xl text-blue-600' />
                </span>
                <div>
                  <h1 className='text-lg font-semibold'>Beginner Level</h1>
                  <p className='text-sm'>No prior experience required.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
        initial="hidden"
        whileInView={"visible"}
        variants={SlideRight(0.5)}
        className='my-[10%] px-10'>
        <div className='md:w-[70%]'>
          <h1 className='font-bold underline'>Course Content</h1>
          <p className='mt-3 text-4xl font-extralight'>
            Our courses are a balanced mix of videos & articles
          </p>
        </div>
        <div className='md:flex items-center mt-5'>
          <ul className='flex-wrap list-inside list-disc flex gap-5   md:gap-20 md:justify-evenly'>
            <li>10 Lessons</li>
            <li>{videoLength} Videos</li>
            <li>14 Assignments</li>
            <li>23h 32m Completion Time</li>
          </ul>
        </div>
        <div className='flex justify-between items-center mt-5 bg-white bg-opacity-40 rounded-2xl'>
      <div className='flex flex-col items-center space-y-4 w-full'>
        {sections.map((sec, index) => (
          <div key={index} className='w-full'>
            <div
              className='flex items-center cursor-pointer p-4 hover:bg-gray-600 rounded-lg'
              onClick={() => toggleSection(index)}
            >
              <FaPlus
                className={`transition-transform duration-300 ${openSection === index ? 'rotate-45' : ''}`}
              />
              <span className='ml-2 text-xl font-semibold'>{sec}</span>
            </div>
            {openSection === index && (
              <div className='px-10 py-4'>
                <div className='flex flex-col space-y-4'>
                  {orderedCourseDetail?.courseDetail?.videos[index] ? (
                    <div className='bg-black p-4 rounded-lg shadow-md'>
                      <VideoPlayer
                        videoUrl={orderedCourseDetail.courseDetail.videos[index]?.fileUrl}
                        
                        description={orderedCourseDetail.courseDetail.videos[index]?.description}
                      />
                    </div>
                  ) : (
                    <p>No video available for this section.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
   {quizDetails!=null?( <div className='my-10 shadow-2xl rounded-lg p-8 text-center'>
  <h1 className='text-3xl font-protest mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text'>
    Have you completed the tutorial?
  </h1>
  <p className='text-lg font-semibold text-gray-600 mb-6 italic'>
    Test your knowledge by taking the quiz now!
  </p>

  <div className="flex items-center justify-center space-x-4">
    <button 
      className='px-6 py-3 font-protest bg-green-500 text-white rounded-full font-medium shadow-md hover:bg-green-600 transition-all flex items-center space-x-2'
      onClick={handelQuiz}>
      <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      <span className='tracking-wide font-protest'>Go to Quiz</span>
    </button>
    <button 
      className='px-6 font-protest py-3 fon bg-gray-300 text-gray-800 rounded-full font-medium shadow-md hover:bg-gray-400 transition-all'>
      Review Tutorial
    </button>
  </div>
</div>
):(
  <div className="flex items-center justify-center space-x-4">
    <h1       className='px-6 my-6 text-3xl font-protest bg-green-500 text-white rounded-full font-medium shadow-md hover:bg-green-600 transition-all flex items-center space-x-2'
    > Sorry,No Quiz available right now</h1>
  </div>
)}


      </motion.div>
    
     
      <div className='mx-10'>
        <div>
            <h1 className='underline font-bold'>About Tutor</h1>
        </div>
        <div className='md:flex justify-between gap-5 mt-10'>
          <div className='w-[100%]'>
           <img className=' object-contain rounded-xl w-[100%]' src={tutorImage} alt="" />
           <p>4.5 Instructor Rating</p>
           <p>28 Reviews</p>

           <p>15 Students</p>

           <p >8 Courses</p>

          </div>
          <div className='md:mt-0 mt-5'>
            <h1 className='text-2xl font-extralight'>{orderedCourseDetail?.courseDetail?.tutorDetails?.tutorname}</h1>
            <p>29 Years Old</p>
            <p>{orderedCourseDetail?.courseDetail?.tutorDetails?.phonenumber}</p>
            <h1 className='mt-5 font-bold text-2xl'>About</h1>
            <p className='w-[100%]'>{orderedCourseDetail?.courseDetail?.tutorDetails?.bio}</p>
          </div>
        </div>
      </div>
      <div className=' mt-10 mx-5'>
          <p className='text-2xl font-extralight'>Do you wanna see {orderedCourseDetail?.courseDetail?.tutorDetails?.tutorname} other courses?</p>
          <h1 onClick={handleOpen} className='mt-2 underline text-blue-400 cursor-pointer'>{courseOpen?'See less':'See More'}</h1>

          </div>
          {courseOpen &&(
          <div className='grid gap-4 md:grid-cols-2 mt-3 lg:grid-cols-3 bg-white bg-opacity-30 p-4 rounded-2xl'>
          {orderedCourseDetail?.otherCourses.map((otherCourse) => (
            <div key={otherCourse._id} onClick={()=>handleNavigate(otherCourse._id)} className='cursor-pointer bg-custom-gradient p-4 rounded-lg shadow-md'>
              <img src={otherCourse.coverImageUrl} alt={otherCourse.title} className='w-full h-40 object-cover rounded-lg' />
              <h3 className='text-xl text-white font-semibold mt-2'>{otherCourse?.title}</h3>
              <hr />
              <p className='text-white text-xl font-bold mt-1'>{otherCourse?.price.toFixed(2)}</p>
              <p className='h-[10vh] overflow-y-scroll mt-2'>{otherCourse?.description}</p>
            </div>
          ))}
        </div> 
        )}          
    </div>
    </>
)}
      </div>

      
  );
}


export default CourseDetails;
