import React, { useState } from 'react';
import image from '../assets/images/OIP (28).jpeg'; // Adjusted path
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signout } from '../redux/student/studentSlice';
import { AppDispatch } from '../redux/store';
import axios from 'axios';
import { clearFeed } from '../redux/feed/feedSlice';

function Header() {
  const [isOpen, setToggle] = useState(false);
  const currentStudent = useSelector((state:unknown) => state.student.currentStudent); // Adjust according to your state structure
  const dispatch=useDispatch<AppDispatch>()
  const toggleMenu = () => {
    setToggle(!isOpen);
  };
  const handleSignout=async()=>{
    try{
      localStorage.removeItem('access_token');

    await axios.get("/backend/auth/signout")

    dispatch(signout())
    dispatch(clearFeed())

    }catch(error){
      console.log(error)
    }
  }
  return (
    <header className="fixed left-0 z-10 h-auto  w-full flex flex-col sm:flex-row justify-between items-center shadow-md p-4 bg-transparent shadow-lg">
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
        <ul className="flex flex-col sm:flex-row justify-end w-full text-white">
          <li className="mx-5">
          <Link to='/' className="hover:text-blue-300 transition-colors duration-300">Home
            </Link>          </li>
          <li className="mx-5">
          <Link to='/' className="hover:text-blue-300 transition-colors duration-300">Courses
          </Link>           </li>
          <li className="mx-5">
          <Link to='/tutorsignup' className="hover:text-blue-300 transition-colors duration-300">Tutor Signup
          </Link>           </li>
          <li className="mx-5">
            <Link onClick={handleSignout}to='/signup' className="hover:text-blue-300 transition-colors duration-300">
              {currentStudent ? "Signout" : "Student Signup"}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
