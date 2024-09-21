import React from 'react';
import LandingFeed from './LandingFeed';
import { Button } from '@material-tailwind/react';
import heroImg from '../assets/images/hero-Dv8sjFKx.png'
import { FaPlay } from 'react-icons/fa';
import {motion} from 'framer-motion'
import { SlideRight } from '../animation/animation';
function LandingDescription() {
  return (
    <>
    <div className='container  grid grid-cols-1 md:grid-cols-2 w-full mx-auto min-h-[650px] relative'>
      <div className='flex flex-col justify-center py-14 md:pl-16 xl:pr-40 md:py-0'>
      <div className='text-center md:text-left space-y-6'>
            <motion.p
            variants={SlideRight(0.4)}
            initial="hidden"
            animate="visible"
            className='text-orange-600 uppercase'>100% Satisfaction Guarentee</motion.p>
            <motion.h1
            variants={SlideRight(0.6)}
            initial="hidden"
            animate="visible"
            className='text-5xl font-semibold  lg:text-6xl text-white'>Find your Perfect <span className='text-yellow-700 font-protest'>Tutor</span></motion.h1>
            <motion.p
            variants={SlideRight(0.8)}
            initial="hidden"
            animate="visible"
            className='text-gray-100 font-poppins'
            >
              We help you find Perfect Tutor for 1 to 1 lessons
              It is 
              completely free and private
            </motion.p>
            <motion.div
             variants={SlideRight(1.0)}
             initial="hidden"
             animate="visible"
            className='flex gap-4 justify-center md:justify-start !mt-8 items-center'>
            <Button className='bg-yellow-700 font-semibold px-6 py-3 rounded-full hover:!scale-110 hover:!shadow-xl duration-300'>Get Started</Button>
            <Button className='flex justify-end items-center gap-2 font-semibold bg-gray-800 rounded-full text-white border-indigo-200 shadow-2xl' ><span className='w-5 h-5  bg-blue-400 rounded-full flex  justify-center items-center'><FaPlay className='text-blue-300'/></span>See how it works</Button>
      </motion.div>
      </div>
      </div>
      <div className='flex justify-center items-center'>
      <motion.img
      initial={{opacity:0,x:200}}
      animate={{opacity:1,x:0}}
      transition={{type:"spring",stiffness:100,delay:0.2}}
      className='w-[350px] md:w-[550px] lg:w-[700px]' src={heroImg} alt="No image" />
    </div>

    </div>
    <LandingFeed/>

   
   </>
  );
}

export default LandingDescription;
