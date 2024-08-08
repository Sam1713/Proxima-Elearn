// TutorLayout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../headers/Header'; // Adjust the path as necessary
import TutorSidebar from './TutorSidebar';

const TutorLayout: React.FC = () => {
  const location = useLocation();
  
  // List the paths where the sidebar should be visible
  const sidebarPaths = ['/tutorprofile']; // Add more paths as needed

  const showSidebar = sidebarPaths.includes(location.pathname);

  return (
    <div className='bg-custom-gradient '>
      <Header />
      <div className='md:flex'>
        {showSidebar && <TutorSidebar />} {/* Conditionally render the sidebar */}
        <div className={`w-[100%] ${showSidebar ? 'md:pt-16' : ''}`}> {/* Adjust margin if sidebar is present */}
          <Outlet />
        </div>
      </div>
    </div>
  )
};

export default TutorLayout;
