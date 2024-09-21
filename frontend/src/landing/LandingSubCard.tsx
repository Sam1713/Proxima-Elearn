import React from 'react'
import {delay, motion} from 'framer-motion'
import { FaBook, FaComment } from 'react-icons/fa'
import LandingReview from './LandingReview'


const subjectList=[
    {
        id:1,
        name:"Engineering",
        icon:<FaBook/>,
        color:"#0063ff",
        delay:0.2
    },
    {
        id:2,
        name:"Web Development",
        color:'#00c986',
        icon:<FaComment/>,
        delay:0.3
    },
    {
        id:1,
        name:"Data Structure",
        color:"#922aee",
        icon:<FaBook/>,
        delay:0.4
    },
    {
        id:1,
        name:"English",
        color:"#ea7516",
        icon:<FaBook/>,
        delay:0.5
    },
    {
        id:1,
        name:"Artificial Intelligence",
        color:"#075267",
        icon:<FaBook/>,
        delay:0.6
    },
    {
        id:1,
        name:"Programming",
        color:"#986d1d",
        icon:<FaBook/>,
        delay:0.7
    },
    {
        id:1,
        name:"Web Design",
        color:"#b93838",
        icon:<FaBook/>,
        delay:0.8
    },
    {
        id:1,
        name:"See all",
        color:"#464646",
        icon:<FaBook/>,
        delay:0.9
    },
]
const LandingSubCard = () => {
  return (
    <>
      <div className='py-14 md:py-24'>
              <div className='space-y-4 p-6 text-center max-w-[600px] mx-auto mb-5'>
                <h1 className='uppercase font-semibold text-orange-500'>Our Tutor Subjects</h1>
                <p className='font-semibold text-3xl text-white'>Find Online Tutor in Any Subjexts</p>
              </div>
         <div className='w-[70%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
           {
            subjectList.map((sub)=>{
                return(
                    <motion.div
                    key={sub.id}
                    initial={{opacity:0,x:-200}}
                    whileInView={{opacity:1,x:0}}
                    transition={{type:"spring",stiffness:100,delay:sub.delay}}

                    className='border rounded-lg border-indigo-100  text-white bg-opacity-20 p-4 flex items-center gap-4 font-serif text-lg hover:!scale-105 hover:!shadow-xl duration-300 cursor-pointer'>
                        <div style={{color:sub.color,backgroundColor:sub.color+"50"}}  className='w-10 h-10 rounded-md flex justify-center items-center'>
                            {sub.icon}
                        </div>
                        <p>{sub.name}</p>
                    </motion.div>
                )
            })
           }
         </div>
      </div>
      <LandingReview/>

      </>
  )
}

export default LandingSubCard
