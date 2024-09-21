// src/firebase/googleAuth.tsx
import { GoogleAuthProvider,signInWithPopup,getAuth } from 'firebase/auth';
import React from 'react';
import { app } from '../firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess } from '../redux/student/studentSlice';
import { Button } from '@material-tailwind/react';
import { FcGoogle } from 'react-icons/fc';

export const GoogleAuth: React.FC = () => {
  const currentStudent=useSelector((state)=>state.student.currentStudent)
  const dispatch=useDispatch()
  const navigate=useNavigate()
    const handleGoogleClick=async()=>{
        try{
            const provider=new GoogleAuthProvider()
            const auth=getAuth(app)
            const result=await signInWithPopup(auth,provider)
            const response = await axios.post(
              '/backend/auth/google',
              { username: result.user.displayName, email: result.user.email, photo: result.user.photoURL },
              {
                withCredentials: true,
                 credentials:'include'
               
                
              }
            );
            localStorage.setItem('access_token', response.data.token);
            console.log('dsfsdf', localStorage.setItem('access_token', response.data.token))
      console.log('res', response);
      console.log(response.data.token);
      localStorage.setItem('access_token', response.data.token); // Save the new token
      console.log('Token saved:', localStorage.getItem('access_token'));



      dispatch(signInSuccess({
        id: result.user.uid,
        name: result.user.displayName || '',
        email: result.user.email || '',
        profilePic: result.user.photoURL || '',
      }));
            navigate('/feedHome')
            console.log(result)
        }catch(error){
            console.log(error)
        }
    }
  return (
    <div>
      {/* <button
       onClick={handleGoogleClick}
        type="button"
        className="my-5 w-full bg-slate-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
      >
        
      </button> */}

      <Button
       onClick={handleGoogleClick}
      type='submit'
      className="w-full my-5 flex items-center justify-center bg-green-400 py-2 px-4 rounded-lg shadow-md hover:bg-green-500 transition-colors">
  <span className="mr-2">
    <FcGoogle className="w-6 h-6" />
  </span>
  <span>Continue with Google</span>
</Button>
    </div>
  );
};
