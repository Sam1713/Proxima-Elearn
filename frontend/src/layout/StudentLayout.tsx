// StudentLayout.tsx
import React from 'react';
import Header from '../headers/Header'; // Adjust the path as necessary
import { Outlet } from 'react-router-dom';

const StudentLayout: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default StudentLayout;  