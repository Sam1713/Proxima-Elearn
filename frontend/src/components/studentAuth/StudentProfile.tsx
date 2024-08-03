import React, { useState } from 'react';
import { MdManageAccounts, MdMenu, MdClose } from "react-icons/md";
import { BiSolidVideos } from "react-icons/bi";
import { PiBooks } from "react-icons/pi";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosWallet } from "react-icons/io";
import { GiTeacher } from "react-icons/gi";
import StudentProfileDetails from './StudentProfileDetails';
import { Link } from 'react-router-dom';

const StudentProfile: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility
  const [activeItem, setActiveItem] = useState(''); // State for active menu item

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar state

  const handleItemClick = (item: string) => {
    setActiveItem(item); // Set the clicked item as active
    // Navigate to the corresponding page if needed
  };

  return (
    <>
    <div className='font-poppins  md:w-[25%]  md:py-24 md:px-8 max-w-full  md:min-h-screen  transition-opacity duration-50'>
      <div className='flex  flex-col md:flex-row gap-4'>
        {/* Toggle button for mobile view */}
        <button
          onClick={toggleSidebar}
          className='md:hidden mt-20 md:mt-0 text-white p-2 bg-black bg-opacity-80 rounded-lg mb-4'
        >
          {isSidebarOpen ? <MdClose size={30} /> : <MdMenu size={30} />}
        </button>

        <div
          className={`w-full md:w-full flex  md:flex-col md:overflow-auto overflow-scroll gap-3 md:gap-4 p-4 bg-opacity-30 rounded-lg bg-white transition-transform duration-300 md:transform-none ${
            isSidebarOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
          }`}
        >
          <div
            className={`bg-black ${activeItem === 'account' ? 'bg-white bg-opacity-40 ' : 'bg-opacity-80'} text-white p-4 rounded-lg shadow-lg flex cursor-pointer hover:bg-custom-gradient transition-colors duration-300`}
            onClick={() => handleItemClick('account')}
          >
            <div className='flex md:items-start item-center  gap-2'>
              <MdManageAccounts className={`${activeItem==='account'?'text-white':''}`} size={30} />
              <Link to='/studentProfile'>
              <h1 className={` text-md font-semibold ${activeItem === 'account' ? 'text-black' : ''}`}>My Account</h1>              </Link>
            </div>
          </div>
          <div
            className={`bg-black ${activeItem === 'courses' ? 'bg-red-500' : 'bg-opacity-80'} text-white p-4 rounded-lg shadow-lg flex items-center cursor-pointer hover:bg-custom-gradient transition-colors duration-300`}
            onClick={() => handleItemClick('courses')}
          >
            <div className='flex items-center gap-2'>
              <BiSolidVideos size={30} />
              <h1 className='text-md font-semibold'>My Courses</h1>
            </div>
          </div>
          <div
            className={`bg-black ${activeItem === 'books' ? 'bg-black' : 'bg-opacity-80'} text-white p-4 rounded-lg shadow-lg flex items-center cursor-pointer hover:bg-custom-gradient transition-colors duration-300`}
            onClick={() => handleItemClick('books')}
          >
            <div className='flex items-center gap-2'>
              <PiBooks size={30} />
              <h1 className='text-md font-semibold'>My Books</h1>
            </div>
          </div>
          <div
            className={`bg-black ${activeItem === 'cart' ? 'bg-red-500' : 'bg-opacity-80'} text-white p-4 rounded-lg shadow-lg flex items-center cursor-pointer hover:bg-custom-gradient transition-colors duration-300`}
            onClick={() => handleItemClick('cart')}
          >
            <div className='flex items-center gap-2'>
              <FaShoppingCart size={30} />
              <h1 className='text-md font-semibold'>My Cart</h1>
            </div>
          </div>
          <div
            className={`bg-black ${activeItem === 'wallet' ? 'bg-red-500' : 'bg-opacity-80'} text-white p-4 rounded-lg shadow-lg flex items-center cursor-pointer hover:bg-custom-gradient transition-colors duration-300`}
            onClick={() => handleItemClick('wallet')}
          >
            <div className='flex items-center gap-2'>
              <IoIosWallet size={30} />
              <h1 className='text-md font-semibold'>My Wallet</h1>
            </div>
          </div>
          <div
            className={`bg-black ${activeItem === 'tutors' ? 'bg-red-500' : 'bg-opacity-80'} text-white p-4 rounded-lg shadow-lg flex items-center cursor-pointer hover:bg-custom-gradient transition-colors duration-300`}
            onClick={() => handleItemClick('tutors')}
          >
            <div className='flex items-center gap-2'>
              <GiTeacher size={30} />
              <h1 className='text-md font-semibold'>My Tutors</h1>
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
}

export default StudentProfile;
