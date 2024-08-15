import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store'; // Adjust the path as necessary

export default function TutorPrivateRoute() {
  const currentTutor = useSelector((state: RootState) => state.tutor.currentTutor);
  const isApproved=useSelector((state:RootState)=>state.tutor.tutorApproval)
  const token=localStorage.getItem('tutor_access_token')
  console.log('curr',currentTutor)
  console.log('tok',token)

  if (!currentTutor || !token || !isApproved) {
    return <Navigate to="/tutorSignin" />;
  }

  return <Outlet />;
} 

