
import { RootState } from '../redux/store'; // Adjust the path as necessary

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const StudentPrivateRoute: React.FC = () => {
  const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
  const token = localStorage.getItem('access_token');
  console.log('StudentPrivateRoute - Token:', token); // Debugging line


  if (!currentStudent || !token) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
};

export default StudentPrivateRoute;


