// Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentProfile from '../components/studentAuth/StudentProfile'; // Import your sidebar component

const Layout: React.FC = () => {
  return (
    <div className='md:flex w-[100%] bg-custom-gradient min-h-screen '>
      <div className='md:w-[20%]'>
      <StudentProfile /> {/* Sidebar */}
      </div>
      
      <main className="bg-custom-gradient rounded-xl md:mt-20 md:w-[75%] ml-[4%] "> {/* Main content area */}
        <Outlet /> {/* Renders the matched child route */}
      </main>
      </div>
  );
};

export default Layout;
