

import { useSelector } from 'react-redux';
import { Navigate, Outlet} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from '../redux/store'; // Adjust the path as necessary

const StudentPrivateRoute: React.FC = () => {
  const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
  const token = localStorage.getItem('access_token');
  console.log('StudentPrivateRoute - Token:', token); // Debugging line
 

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
