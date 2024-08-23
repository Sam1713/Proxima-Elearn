import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store'; // Adjust the path as necessary
import {useEffect} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function PublicRoute() {
  const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
  const currentTutor = useSelector((state: RootState) => state.tutor.currentTutor);
  useEffect(() => {
    if (currentStudent?.isBlocked) {
      toast.error("Your account has been blocked. Please contact supp.");
    }
  }, [currentStudent?.isBlocked]);

  if (currentStudent && !currentStudent?.isBlocked) {
    return <Navigate to="/feedHome" />;
  }
  
//   if (currentTutor) {
//     return <Navigate to="/tutorWait" />;
//   }
  
  
return (
  <>
    <ToastContainer />
    <Outlet />
  </>
);
}
