import React from 'react';
import profileImage from '../assets/images/e37e0e25686c2139b281a57a5b4906f2.jpg'; // Ensure the path is correct
import achievementImage1 from '../assets/images/LeetCode_Sharing.png'; // Ensure the path is correct
import { AiFillLike } from "react-icons/ai";
import LandingFooter from './LandingFooter';
import CountUp from 'react-countup';
import LandingCategory from './LandingCategory';
function LandingFeed() {
  return (
    <>
<div className='bg-black w-[90%] mx-auto text-white py-12 px-4 border-4 border-lime-200 rounded-xl'>
<div className="container grid grid-cols-2 md:grid-cols-4 gap-8 mx-auto">
        <div className='flex flex-col items-center justify-center'>
          
      
       <p className="text-3xl font-semibold">
         <CountUp start={0} end={898} duration={3} enableScrollSpy={true} scrollSpyOnce={true}/>
       </p>
       <p>Expert Tutors</p>
       </div>
      
       <div className='flex flex-col items-center justify-center'>
       <p className="text-3xl font-semibold">
        <CountUp
        end={20000}
        separator=','
        suffix='+'
        duration={3}
        enableScrollSpy={true}
        scrollSpyOnce={true}/>
       </p>
      <p>Hour's Content</p>
      </div>
      <div className='flex flex-col items-center justify-center'>
      <p className="text-3xl font-semibold">
      <CountUp
        end={278}
        duration={3}
        enableScrollSpy={true}
        scrollSpyOnce={true}/>
      </p>
      <p>Subject and Courses</p>
      </div>
      <div className='flex flex-col items-center justify-center'>
      <p className="text-3xl font-semibold">

      <CountUp
        end={72489}
        separator=','
        suffix='+'
        duration={3}
        enableScrollSpy={true}
        scrollSpyOnce={true}/>
      </p>
      <p>Active Students </p>
      </div>
      </div>
    </div>
    <LandingCategory/>
     </>
  );
}

export default LandingFeed;