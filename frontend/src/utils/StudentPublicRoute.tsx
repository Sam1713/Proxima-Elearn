import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store';

const StudentPublicRoute: React.FC = () => {
  const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
  const token = localStorage.getItem('access_token');

  if (currentStudent && token) {
    return <Navigate to="/feedHome" />;
  }

  return <Outlet />;
};

export default StudentPublicRoute;
