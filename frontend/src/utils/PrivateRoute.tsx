
// import { RootState } from '../redux/store'; // Adjust the path as necessary

// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';

// const StudentPrivateRoute: React.FC = () => {
//   const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
//   const token = localStorage.getItem('access_token');
//   console.log('StudentPrivateRoute - Token:', token); // Debugging line


//   if (!currentStudent || !token || currentStudent?.isBlocked) {
//     return <Navigate to="/signin" />;
//   }

//   return <Outlet />;
// };

// export default StudentPrivateRoute;


import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from '../redux/store'; // Adjust the path as necessary

const StudentPrivateRoute: React.FC = () => {
  const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
  const token = localStorage.getItem('access_token');
  console.log('StudentPrivateRoute - Token:', token); // Debugging line
  // useEffect(() => {
  //   if (currentStudent?.isBlocked) {
  //     console.log('fsdfs')
  //     toast.error("Your account has been blocked. Please contact support.");
  //   }
  // }, []);

  if (!currentStudent || !token || currentStudent?.isBlocked) {
    return <Navigate 
    to="/signin" 
  />;
  }

  return (
    <>
      {/* <ToastContainer /> */}
      <Outlet />
    </>
  );
};

export default StudentPrivateRoute;
