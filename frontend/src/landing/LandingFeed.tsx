import React from 'react';
import profileImage from '../assets/images/e37e0e25686c2139b281a57a5b4906f2.jpg'; // Ensure the path is correct
import achievementImage1 from '../assets/images/LeetCode_Sharing.png'; // Ensure the path is correct
import { AiFillLike } from "react-icons/ai";
import LandingFooter from './LandingFooter';

function LandingFeed() {
  return (
    <>
    <div className='w-11/12 md:w-3/4 lg:w-1/2 mt-20 mx-auto space-y-10'>
      {/* Post 1 */}
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-center mb-4'>
          <img className='w-16 h-16 rounded-full mr-4' src={profileImage} alt="Profile" />
          <div>
            <span className='block font-bold text-lg'>Jeff Dahmers</span>
            <p className='text-gray-500 text-sm'>Mar 15 12.15pm</p>
          </div>
        </div>
        <p className='text-gray-700 mb-4'>
          Excited to share that I've achieved the 50 Days Accomplishment badge on LeetCode! Throughout the last year, I dedicated myself to consistent practice and problem-solving, honing my coding skills on LeetCode for over 50 days. 💻 Solving challenges and embracing the learning journey has been both challenging and immensely rewarding.
        </p>
        <p className='text-blue-500 font-semibold mb-4'>#LeetCode #Programming</p>

        <div className='mb-6'>
          <img className='rounded-md w-full' src={achievementImage1} alt="Achievement" />
        </div>

        <div className='flex items-center mb-6'>
          <AiFillLike className='text-blue-500 text-2xl mr-2' />
          <span className='text-gray-700'>200 likes</span>
        </div>

        <div className='border-t border-gray-200 pt-4'>
          <h3 className='text-lg font-semibold mb-2'>Comments</h3>
          <div className='mb-4'>
            <div className='flex items-center mb-2'>
              <img className='w-8 h-8 rounded-full mr-2' src={profileImage} alt="Commenter" />
              <div>
                <span className='block font-bold text-sm'>Jane Doe</span>
                <p className='text-gray-600 text-sm'>Congrats on the achievement!</p>
              </div>
            </div>
            <div className='flex items-center mb-2'>
              <img className='w-8 h-8 rounded-full mr-2' src={profileImage} alt="Commenter" />
              <div>
                <span className='block font-bold text-sm'>John Smith</span>
                <p className='text-gray-600 text-sm'>Great job, keep it up!</p>
              </div>
            </div>
          </div>
          <form>
            <input
              type='text'
              placeholder='Add a comment...'
              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </form>
        </div>
      </div>

      {/* Post 2 */}
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <div className='flex items-center mb-4'>
          <img className='w-16 h-16 rounded-full mr-4' src={profileImage} alt="Profile" />
          <div>
            <span className='block font-bold text-lg'>Alice Johnson</span>
            <p className='text-gray-500 text-sm'>Apr 10 10:30am</p>
          </div>
        </div>
        <p className='text-gray-700 mb-4'>
          Thrilled to announce that I've completed the Machine Learning course on Coursera! This journey has been incredibly enlightening, providing deep insights into algorithms and practical applications. 📚 Eager to apply these new skills in upcoming projects.
        </p>
        <p className='text-blue-500 font-semibold mb-4'>#MachineLearning #Education</p>

        <div className='mb-6'>
          <img className='rounded-md w-full' src={achievementImage1} alt="Achievement" />
        </div>

        <div className='flex items-center mb-6'>
          <AiFillLike className='text-blue-500 text-2xl mr-2' />
          <span className='text-gray-700'>150 likes</span>
        </div>

        <div className='border-t border-gray-200 pt-4'>
          <h3 className='text-lg font-semibold mb-2'>Comments</h3>
          <div className='mb-4'>
            <div className='flex items-center mb-2'>
              <img className='w-8 h-8 rounded-full mr-2' src={profileImage} alt="Commenter" />
              <div>
                <span className='block font-bold text-sm'>Bob Brown</span>
                <p className='text-gray-600 text-sm'>Amazing achievement!</p>
              </div>
            </div>
            <div className='flex items-center mb-2'>
              <img className='w-8 h-8 rounded-full mr-2' src={profileImage} alt="Commenter" />
              <div>
                <span className='block font-bold text-sm'>Clara White</span>
                <p className='text-gray-600 text-sm'>Well done, Alice!</p>
              </div>
            </div>
          </div>
          <form>
            <input
              type='text'
              placeholder='Add a comment...'
              className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </form>
        </div>
      </div>
     
    </div>
     <LandingFooter/>
     </>
  );
}

export default LandingFeed;
