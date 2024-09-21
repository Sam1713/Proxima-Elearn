import React, { useEffect, useState } from 'react';
import image from '../assets/images/OIP (28).jpeg'; // Adjusted path
import { Bars3Icon, ChevronDownIcon, Cog6ToothIcon, InboxArrowDownIcon, LifebuoyIcon, PowerIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setStudentNotifications, signout } from '../redux/student/studentSlice';
import { AppDispatch, RootState } from '../redux/store';
import axios from 'axios';
import { clearFeed } from '../redux/feed/feedSlice';
import Notifications from '../components/studentNotification/Notification';
import NotificationBadge from 'react-notification-badge'; // Import NotificationBadge

import api from '../components/API/Api'
import { FaChalkboardTeacher, FaHome } from 'react-icons/fa';
import { Avatar, Button, Menu, MenuHandler, MenuItem, MenuList, Tooltip, Typography } from '@material-tailwind/react';
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
    route:'/studentProfile'
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
  },
  {
    label: "Inbox",
    icon: InboxArrowDownIcon,
    route:'/studentChat'
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
    route:'/signout'
  },
];
 
function StudentHeader() {
  const [isOpen, setToggle] = useState(false);
  const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
  const dispatch = useDispatch<AppDispatch>();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const location=useLocation()
  const toggleMenu = () => {
    setToggle(!isOpen);
  };

  const handleSignout = async () => {
    try {
      localStorage.removeItem('access_token');
      await axios.get("/backend/auth/signout");
      dispatch(signout());
      dispatch(clearFeed());
    } catch (error) {
      console.log(error);
    }
  };
  const studentNotification=useSelector((state:RootState)=>state.student.Notifications)
  console.log('st',studentNotification)

  useEffect(()=>{
    if (currentStudent) {
      console.log('hai')
      fetchNotifications();
    }
  },[currentStudent, dispatch,location])

  const fetchNotifications=async()=>{
    const response=await api.get('/backend/auth/getNotifications',{
         headers:{
          'X-Token-Type':'student'
         }
    })
    dispatch(setStudentNotifications(response.data))
    console.log('res',response)
  }
  return (
    <header className="fixed bg-custom-gradient left-0 z-10 h-auto w-full flex flex-col sm:flex-row justify-between items-center p-4 bg-transparent shadow-lg">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex items-center">
          <img className="w-10 h-10 mx-4 rounded-full" src={image} alt="Landing" />
          <h3 className="md:w-40 text-sm font-bold text-white">Proxima E-Learn</h3>
        </div>
        <div className="sm:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <XMarkIcon className="w-6 h-6 text-white" /> : <Bars3Icon className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>
      <nav className={`w-full ${isOpen ? 'block' : 'hidden'} sm:flex mt-4 sm:mt-0`}>
        <ul className="flex flex-col sm:flex-row justify-end w-full text-white items-center">
          <li className="mx-5">
          <Tooltip content="Home" placement="top">

          <Link to='/' className="hover:text-blue-300 transition-colors duration-300">
  <FaHome size={25} />
</Link>
</Tooltip>
          </li>
          <li className="mx-5">
      <Tooltip content="Courses" placement="top">
        <Link
          to="/courses"
          className="hover:text-blue-300 transition-colors duration-300"
        >
          <FaChalkboardTeacher size={25} />
        </Link>
      </Tooltip>
    </li>
          <li className="mx-5 relative text-white">
  <div className="relative">
    <NotificationBadge count={studentNotification.length} className="absolute top-0 right-0">
      {/* Apply any additional styling for the badge if needed */}
    </NotificationBadge>
    
  </div>
  <Notifications />
</li>


         
<li className="mx-5">{
  currentStudent?(
  <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
    <MenuHandler>
      <Button
        variant="text"
        color="blue-gray"
        className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
      >
        <Avatar
          variant="circular"
          size="sm"
          alt="tania andrew"
          className="border border-gray-900 p-0.5"
          src={currentStudent?.profilePic}
        />
        <ChevronDownIcon
          strokeWidth={2.5}
          className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
        />
      </Button>
    </MenuHandler>
    <MenuList className="p-1">
      {profileMenuItems.map(({ label, icon, route }, key) => {
        const isLastItem = key === profileMenuItems.length - 1;
        
        // Add a condition to handle the Sign Out item
        return isLastItem ? (
          <MenuItem
            key={label}
            onClick={() => {
              closeMenu();
              handleSignout(); // Call the sign-out function
            }}
            className="flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
          >
            {React.createElement(icon, {
              className: "h-4 w-4 text-red-500",
              strokeWidth: 2,
            })}
            <Typography
              as="span"
              variant="small"
              className="font-normal"
              color="red"
            >
              {label}
            </Typography>
          </MenuItem>
        ) : (
          <Link to={route} key={label}>
            <MenuItem
              onClick={closeMenu}
              className="flex items-center gap-2 rounded"
            >
              {React.createElement(icon, {
                className: "h-4 w-4",
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
              >
                {label}
              </Typography>
            </MenuItem>
          </Link>
        );
      })}
    </MenuList>
  </Menu>
  ):(
    <Link to={!currentStudent?"/signup":''}>Signup</Link>
  )}
</li>

          {/* Add Notifications Component Here */}
          
        </ul>
      </nav>
    </header>
  );
}

export default StudentHeader;
