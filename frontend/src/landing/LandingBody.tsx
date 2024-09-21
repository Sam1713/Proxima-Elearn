import React, { useState } from 'react'
import image from '../assets/images/OIP__29_-removebg-preview.png'; 
import { FaRegPlayCircle } from "react-icons/fa";
import LandingDescription from './LandingDescription';
import {motion} from 'framer-motion'
import { Link } from 'react-router-dom';
function LandingBody() {
  const [isOpen,setIsOpen]=useState<boolean>(true)
  return (
    
    isOpen &&(
      <>
    <div className='py-20'>
      <motion.div className='bg-orange-200 text-center font-semibold p-1 hidden lg:block relative'>
          Are you a university or school student for an online tutorial partnership?
          <Link to='/' className='text-indigo-200 ml-2'>Talk to us</Link>
          <div onClick={()=>setIsOpen(!isOpen)} className='absolute top-1/2 right-10 cursor-pointer -translate-y-1/2'>
           X
          </div>

      </motion.div>

      </div>
      <LandingDescription/>

      </>
  )
)
}

export default LandingBody
