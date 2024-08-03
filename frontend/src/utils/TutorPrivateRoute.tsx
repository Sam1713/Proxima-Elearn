import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store'; // Adjust the path as necessary

export default function TutorPrivateRoute() {
  const currentTutor = useSelector((state: RootState) => state.tutor.currentTutor);
  console.log('curr',currentTutor)

  return currentTutor ? <Outlet /> : <Navigate to="/tutorSignin" />;
}
