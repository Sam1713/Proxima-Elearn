import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store'; // Adjust the path as necessary

export default function PublicRoute() {
  const currentStudent = useSelector((state: RootState) => state.student.currentStudent);
  const currentTutor = useSelector((state: RootState) => state.tutor.currentTutor);

  if (currentStudent) {
    return <Navigate to="/feedHome" />;
  }
  
//   if (currentTutor) {
//     return <Navigate to="/tutorWait" />;
//   }
  
  return <Outlet />;
}
