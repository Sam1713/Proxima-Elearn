// TutorPublicRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store'; // Adjust the path as necessary

export default function TutorPublicRoute() {
  const currentTutor = useSelector((state: RootState) => state.tutor.currentTutor);
  const isApproved=useSelector((state:RootState)=>state.tutor.tutorApproval)
  console.log('isa',isApproved)
  console.log('tutorcurr',currentTutor)
  const token=localStorage.getItem('tutor_access_token')
  console.log('tok',token)

  if (currentTutor&&token && isApproved) {
    return <Navigate to="/tutorhome" />;
  }

  return <Outlet />;
}
