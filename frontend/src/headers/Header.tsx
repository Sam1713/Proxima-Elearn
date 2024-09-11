import React, { useEffect, useState } from 'react';
import image from '../assets/images/OIP (28).jpeg'; // Adjusted path
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setStudentNotifications, signout } from '../redux/student/studentSlice';
import { AppDispatch, RootState } from '../redux/store';
import axios from 'axios';
import { clearFeed } from '../redux/feed/feedSlice';
import Notifications from '../components/studentNotification/Notification';
import NotificationBadge from 'react-notification-badge'; // Import NotificationBadge

import api from '../components/API/Api'
function StudentHeader() {
  const [isOpen, setToggle] = useState(false);
  const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
  const dispatch = useDispatch<AppDispatch>();
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
            <Link to='/' className="hover:text-blue-300 transition-colors duration-300">Home</Link>
          </li>
          <li className="mx-5">
            <Link to='/courses' className="hover:text-blue-300 transition-colors duration-300">Courses</Link>
          </li>
          <li className="mx-5 relative text-white">
  <div className="relative">
    <NotificationBadge count={studentNotification.length} className="absolute top-0 right-0">
      {/* Apply any additional styling for the badge if needed */}
    </NotificationBadge>
    
  </div>
  <Notifications />
</li>


          <li className="mx-5">
            <Link to='/studentProfile' className="hover:text-blue-300 transition-colors duration-300">Profile</Link>
          </li>
          <li className="mx-5">
            <Link onClick={handleSignout} to='/signup' className="hover:text-blue-300 transition-colors duration-300">
              Signout
            </Link>
          </li>
          {/* Add Notifications Component Here */}
          
        </ul>
      </nav>
    </header>
  );
}

export default StudentHeader;
