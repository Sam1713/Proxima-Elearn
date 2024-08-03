// axiosConfig.ts (or axiosConfig.js)
import axios from 'axios';

// Set the base URL for your API
axios.defaults.baseURL = 'http://localhost:5173'; // Adjust according to your API base URL

// Set the default Authorization header if a token exists
const token = localStorage.getItem('access_token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Optionally, you can add interceptors to handle token refresh or other logic
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error (e.g., refresh token, logout user)
    }
    return Promise.reject(error);
  }
);

export default axios;
