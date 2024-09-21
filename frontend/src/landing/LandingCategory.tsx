import React from 'react'
import { FaDumbbell, FaViadeo } from 'react-icons/fa'
import { GiGymBag } from 'react-icons/gi'
import { GrYoga } from 'react-icons/gr'
import {motion} from 'framer-motion'
import { SlideLeft } from '../animation/animation'
import LandingBanner from './LandingBanner'
import img1 from '../assets/images/banner1-ChWN6Q7z.png'
import img2 from '../assets/images/banner2-BMWB7nzP.png'
import LandingSubCard from './LandingSubCard'
import LandingReview from './LandingReview'
const WhyChooseUs=[
    {
        _id:1,
        title:'One-on-one Teaching',
        desc:'All of our special education experts have a degree in special Education',
        icon:<GrYoga/>,
        bgColor:'#0063ff',
        delay:0.5

    },
    {
        _id:2,
        title:'*24/7 Tutor Availability',
        desc:'Our tutors are always available to respond us quick as possible for you',
        link:'/',
        icon:<FaDumbbell/>,
        bgColor:'#73bc00',
        delay:0.7

    },
    {
        _id:3,
        title:'VideoCall and Real time Chat',
        desc:'Our videoCall and chat services makes you more interactive with respected tutors',
        link:'/',
        icon:<FaViadeo/>,
        bgColor:'#fa6400',
        delay:0.9

    },
    {
        _id:4,
        title:'Affordable Prices',
        desc:'Choose an expert tutor based on your budget and per hour',
        link:'/',
        icon:<GiGymBag/>,
        bgColor:'#fe6baa',
        delay:1.2

    }
]

const BannerData1={
    image:img1,
    tag:'CUSTOMIZE WITH YOUR SCHEDULE',
    title:"Personalized Proffesional Online Tutor on Your Schedule",
    subtitle:
            "Our schedule starts with a brief introduction to the course and the tutor, giving students a clear understanding of the learning objectives. Classes are conducted in real-time, allowing students to interact with tutors and ask questions directly. Each session is carefully planned to ensure a balanced mix of theory and practical exercises. Breaks are scheduled between lessons to ensure students can recharge and stay focused. At the end of each week, we hold a review session to track progress and address any challenges faced during the lessons."
}
const BannerData2={
    image:img2,
    tag:'CUSTOMIZE WITH YOUR SCHEDULE',
    title:"Personalized Proffesional Online Tutor on Your Schedule",
    subtitle:
            "Our schedule starts with a brief introduction to the course and the tutor, giving students a clear understanding of the learning objectives. Classes are conducted in real-time, allowing students to interact with tutors and ask questions directly. Each session is carefully planned to ensure a balanced mix of theory and practical exercises. Breaks are scheduled between lessons to ensure students can recharge and stay focused. At the end of each week, we hold a review session to track progress and address any challenges faced during the lessons."
}

const LandingCategory:React.FC = () => {
  return (
    <>
    <div className=''>
        <div className=" py-24">
            <div className='space-y-4 p-6 text-center max-w-[500px] mx-auto mb-5'>
                <h1 className='uppercase font-semibold text-orange-600'>Why Choose Us</h1>
                <p className='font-semibold text-3xl text-white'>Benefits of online tutoring services with us</p>
            </div>
        

                        <div  className=' md:w-[80%] w-[95%]  mx-auto grid grid-cols-1 md:grid-cols-4 gap-2'>
                        {WhyChooseUs?.map((item)=>{
                    return(
                            <motion.div
                            initial="hidden"
                            whileInView={"visible"}
                            variants={SlideLeft(item.delay)}
                            className='space-y-4 p-4 rounded-xl bg-white md:w-[90%] md:h-[30vh] shadow-lg'
                            style={{ boxShadow: '0 0 30px rgba(10, 255, 255, 1.5)' }}>
                            <div style={{backgroundColor:item.bgColor}} className='w-10 h-10 rounded-lg flex justify-center items-center text-white'>
                                    <div className='text-2xl'>
                                    {item.icon}
                                    </div>
                                </div>
                                <p className='font-semibold'>{item.title}</p>
                                <p className='text-md text-gray-700 font-serif'>{item.desc}</p>
                            </motion.div>
                               )
                            })}
                        </div>
                 
            
        </div>
      
    </div>
    <LandingBanner {...BannerData1}/>
    <LandingBanner {...BannerData2} reverse={true}/>
    <LandingSubCard/> 

    </>
  ) 
}

export default LandingCategory
