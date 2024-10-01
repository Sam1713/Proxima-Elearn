import React, { useState } from 'react';
import { MdDashboard, MdFeed } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { GiTeacher } from 'react-icons/gi';
import { BiSolidVideos, BiSolidPurchaseTagAlt } from 'react-icons/bi';
import { AiOutlineDown, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import TutorListing from '../components/admin/TutorListing';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Link, useNavigate } from 'react-router-dom';

// Define the types for SidebarItem props
interface SidebarItemProps {
  icon: React.ComponentType;
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

function AdminSidebar() {
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(true); // Toggle sidebar state
  const naivagate=useNavigate()
  const toggleCourses = () => setIsCoursesOpen(prev => !prev);
  const handleClick = () => {
    naivagate('/admin/ordersList')
  };
  const tutorlist=useSelector((state:RootState)=>state.admin.singleTutor)

  return (
    <div className='md:fixed pt-10 w-[18%] md:pt-0  flex md:flex-col md:my-[6%] md:mx-3 flex-row justify-between items-center'>
      <button
        onClick={() => setShowSidebar(prev => !prev)}
        className='text-white text-2xl md:hidden absolute top-4 left-4'
      >
        {showSidebar ? <AiOutlineClose className='text-blac' /> : <AiOutlineMenu className='text-black font-bold' />}
      </button>
      <div className={`md:flex ${showSidebar ? 'flex ' : 'hidden'} p-4 mt-6  md:w-[100%] w-full bg-custom-gradient md:h-[80vh] overflow-scroll md:overflow-hidden  bg-opacity-60 rounded-xl`}>
        <div className='md:m-auto  flex md:flex-col md:gap-0 gap-4 flex-row md:w-full w-auto'>
        <Link to='/admin/dashboard'>

          <SidebarItem
            icon={MdDashboard}
            text='Dashboard'
            onClick={() => handleClick('dashboard')}
            isActive={activeItem === 'dashboard'}
            arrow={false}
          />
          </Link>
          <Link to='/admin/userlisting'>
           <SidebarItem
            icon={FaUsers}
            text='Users'
            onClick={() => handleClick('users')}
            isActive={activeItem === 'users'}
            arrow={false}
          />
          </Link>
          <Link to='/admin/tutorlist'>
          <SidebarItem
            icon={GiTeacher}
            text='Tutors'
            onClick={() => handleClick('tutors')}
            isActive={activeItem === 'tutors'}
            arrow={false}
          />
          </Link>
          <SidebarItem
            icon={BiSolidVideos}
            text='OrderedCourses'
            onClick={toggleCourses}
            isActive={activeItem === 'courses'}
            arrow={true}
          />
          {isCoursesOpen && (
            <div className='pl-8 mt-2'>
              <SidebarItem
                icon={() => <span className='text-xl' />} // Placeholder for Course Details icon
                text='Course Details'
                onClick={() => {}}
                isActive={false}
                arrow={false}
              />
              <SidebarItem
                icon={() => <span className='text-xl' />} // Placeholder for Course Edit icon
                text='Course Edit'
                onClick={() => {}}
                isActive={false}
                arrow={false}
              />
            </div>
          )}
          <Link to='/admin/category'>
          <SidebarItem
            icon={MdFeed}
            text='Category'
            onClick={() => handleClick('feeds')}
            isActive={activeItem === 'feeds'}
            arrow={false}
          />
          </Link>
          <SidebarItem
            icon={BiSolidPurchaseTagAlt}
            text='Orders'
            onClick={() => handleClick('orders')}
            isActive={activeItem === 'orders'}
            arrow={false}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
