import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: '', 
  withCredentials: true, 
});
 
const getToken = (config: any) => {
  const tokenType = config.headers['X-Token-Type']; 
  console.log('tokentype',tokenType)
 
  switch (tokenType) {
    case 'tutor':
      return localStorage.getItem('tutor_access_token');
    case 'admin':
      return localStorage.getItem('admin_access_token');
      case 'student':
        return localStorage.getItem('access_token')
        default:
          console.error('Invalid token type');
          return null; 
      }
  
};
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken(config);
    console.log('token',token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('config',config)
    return config;
  },
  (error) => {
    toast.error('Request error. Please try again.');
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      toast.error(error.response.data.message || 'An error occurred.');
    } else if (error.request) {
      toast.error('No response from server. Please try again.');
    } else {
      toast.error('Request setup error. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
