import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { Navigate, Outlet } from "react-router-dom"

const AdminPrivateRoute:React.FC=()=>{
  const currentAdmin=useSelector((state:RootState)=>state.admin.currentAdmin)
  const token=localStorage.getItem('admin_access_token')
  console.log('AdminPrivateRoute - Token:', token); // Debugging line

if (!currentAdmin || !token) {
    return <Navigate to="/admin/adminLogin" />;
  }

  return <Outlet />;
}
export default AdminPrivateRoute