import React, { useState } from 'react';
import { MdDashboard, MdFeed } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { GiTeacher } from 'react-icons/gi';
import { BiSolidVideos } from 'react-icons/bi';
import { AiOutlineDown, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Link } from 'react-router-dom';

// Define the types for SidebarItem props
interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  onClick: () => void;
  isActive: boolean;
  arrow?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, text, onClick, isActive, arrow }) => (
  <div
    onClick={onClick}
    className={`relative p-3 my-4 rounded-xl flex items-center cursor-pointer hover:bg-opacity-15 ${isActive ? 'bg-custom-gradient text-white' : 'bg-white bg-opacity-55'} md:w-full w-auto`}
  >
    <Icon className='mr-2 md:mr-0' />
    <h1 className='md:mx-6 mx-4 font-serif font-bold md:flex-grow'>{text}</h1>
    {arrow && (
      <span className={`transition-transform ${isActive ? 'rotate-180' : ''} text-lg`}>
        <AiOutlineDown />
      </span>
    )}
  </div>
);

function TutorSidebar() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(true); // Toggle sidebar state

  const handleClick = (item: string) => {
    setActiveItem(prev => (prev === item ? null : item));
  };

  return (
    <div className='md:w-[20%] z-10 md:fixed overflow-x-scroll md:overflow-x-hidden pt-16 flex md:flex-col md:mx-3 flex-row justify-between items-center'>
      <button
        onClick={() => setShowSidebar(prev => !prev)}
        className='text-white text-2xl md:hidden absolute top-4 left-4'
      >
        {showSidebar ? <AiOutlineClose className='text-black' /> : <AiOutlineMenu className='text-black font-bold' />}
      </button>
      <div className={`md:flex ${showSidebar ? 'flex ' : 'hidden'} p-4 mt-6 md:w-[100%] w-full bg-gradient-to-r from-black via-gray-1000 to-white md:h-[75vh] overflow-scroll md:overflow-hidden bg-opacity-60 rounded-xl`}>
        <div className='md:m-auto flex md:flex-col md:gap-0 gap-4 flex-row md:w-full w-auto'>
          <Link to='/tutorprofile'>
            <SidebarItem
              icon={MdDashboard}
              text='My Account'
              onClick={() => handleClick('dashboard')}
              isActive={activeItem === 'dashboard'}
              arrow={false}
            />
          </Link>
          <Link to='/purchasedStudents'>
            <SidebarItem
              icon={FaUsers}
              text='My Students'
              onClick={() => handleClick('users')}
              isActive={activeItem === 'users'}
              arrow={false}
            />
          </Link>
          <Link to='/tutorWallet'>
            <SidebarItem
              icon={GiTeacher}
              text='My Wallet'
              onClick={() => handleClick('tutors')}
              isActive={activeItem === 'tutors'}
              arrow={false}
            />
          </Link>
          <Link to="/getTutorCourses"> {/* Direct link to the courses page */}
            <SidebarItem
              icon={BiSolidVideos}
              text='My Courses'
              onClick={() => handleClick('courses')} // Optional, if you want to track active item
              isActive={activeItem === 'courses'}
              arrow={false} // No arrow since it's not a dropdown
            />
          </Link>
          <Link to={'/tutorChat'}>
            <SidebarItem
              icon={MdFeed}
              text='Chats'
              onClick={() => handleClick('Chats')}
              isActive={activeItem === 'feeds'}
              arrow={false}
            />
          </Link>
          {/* <SidebarItem
            icon={BiSolidPurchaseTagAlt}
            text='Orders'
            onClick={() => handleClick('orders')}
            isActive={activeItem === 'orders'}
            arrow={false}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default TutorSidebar;
