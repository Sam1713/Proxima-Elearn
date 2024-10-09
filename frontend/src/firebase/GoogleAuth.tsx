// src/firebase/googleAuth.tsx
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import React from 'react';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { signInSuccess } from '../redux/student/studentSlice';
import { Button } from '@material-tailwind/react';
import { FcGoogle } from 'react-icons/fc';
import api from '../components/API/Api'
export const GoogleAuth: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      
      // Prepare user data for the request
      const userData = {
        username: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };

      const response = await api.post('/backend/auth/google',
        userData,
        {
          withCredentials: true,
        }
      );

      // Save the token from the response
      localStorage.setItem('access_token', response.data.token);
      console.log('Token saved:', localStorage.getItem('access_token'));

      // Dispatch the sign-in success action
      dispatch(signInSuccess({
        _id: result.user.uid,
        username: result.user.displayName || '',
        email: result.user.email || '',
        profilePic: result.user.photoURL || '',
      }));

      // Navigate to the feed home page
      navigate('/feedHome');
    } catch (error) {
      console.log('Error during Google authentication:', error);
    }
  };

  return (
    <div>
      <Button
        onClick={handleGoogleClick}
        type='submit'
        className="w-full my-5 flex items-center justify-center bg-green-400 py-2 px-4 rounded-lg shadow-md hover:bg-green-500 transition-colors" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        <span className="mr-2">
          <FcGoogle className="w-6 h-6" />
        </span>
        <span>Continue with Google</span>
      </Button>
    </div>
  );
};
