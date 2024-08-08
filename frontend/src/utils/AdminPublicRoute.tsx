import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store'; // Adjust the path as necessary

export default function AdminPublicRoute() {
  const currentAdmin = useSelector((state: RootState) => state.admin.currentAdmin);

  if (currentAdmin) {
    return <Navigate to="/admin/tutorlist" />;
  }
  

  return <Outlet />;
}
