// TutorPublicRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store'; // Adjust the path as necessary

export default function TutorPublicRoute() {
  const currentTutor = useSelector((state: RootState) => state.tutor.currentTutor);

  return currentTutor ? <Navigate to="/tutorWait" /> : <Outlet />;
}
