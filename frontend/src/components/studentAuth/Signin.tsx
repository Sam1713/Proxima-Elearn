import React, { useEffect, useState } from "react";
import { SigninType } from "../../types/Register";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { override, color } from "../../utils/ClipLoader";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signInFailure } from "../../redux/student/studentSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import api from '../API/Api';
import { Button, Input, Typography } from "@material-tailwind/react";
import { FcGoogle } from "react-icons/fc";
import {motion} from 'framer-motion'
const Signin: React.FC = () => {
  const [form, setForm] = useState<SigninType>({ email: "", password: "" });
  const navigate = useNavigate();
  // const { loading, error } = useSelector((state: RootState) => state.student);
  const [loading,setLoading]=useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>();
 const currentStudent=useSelector((state:RootState)=>state.student.currentStudent)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
console.log('currentStudent?.isBlocked',currentStudent)
 useEffect(()=>{
 if(currentStudent?.isBlocked){
      toast.error( "Your account has beenn.");
 }
   
 },[currentStudent?.isBlocked])
 console.log('s',loading)

 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true)
      dispatch(signInStart());
      const response = await api.post("/auth/signin", form);
      localStorage.setItem('access_token', response.data.token);
      console.log('Token saved:', localStorage.getItem('access_token'));
      setLoading(false)
      dispatch(signInSuccess(response.data.rest));
      toast.success(response.data.message);
      navigate('/feedHome');
    } catch (error: unknown) {
      setLoading(false)
      dispatch(signInFailure())
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response as { status: number; data: { error: string } };
        if (status === 403 && data.error === 'UserBlocked') {
          toast.error("Your account has been blocked. Please sign in again.");
          localStorage.removeItem('access_token');
          navigate('/signin');
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex h-screen shadow-2xl items-center justify-center p-4 bg-black">
      <ToastContainer />
      <div className="flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        
        <motion.div className="flex-1 flex items-center justify-center p-4 mx-[-11%]"
        initial={{ opacity: 0, y: 200 }} 
  animate={{ opacity: 1, y: 0 }}    
  transition={{ duration: 0.8, ease: "easeOut" }} >
          <form onSubmit={handleSubmit}
                className="w-full max-w-sm p-8 bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6 font-protest">Login</h2>
            <div className="mb-6">

            <Input
                onChange={handleChange}
                color="white"
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded  focus:border-blue-500 "
                size="md"
                label="Username"
                labelProps={{
                  className: "text-white", // Change the label color here
                }} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}/>


            </div>
            <div className="mb-6">

            <Input
                onChange={handleChange}
                color="white"
                id="password"
                name="password"
                type="password" label="Password" crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      <Typography
                variant="small"
                color="gray"
                className="mt-2 flex items-center gap-1 font-normal"placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="-mt-px h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
        Use at least 8 characters, one uppercase, one lowercase and one number.
      </Typography>
             
            </div>
            <Button
              type="submit"
              className="w-full mb-2 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {loading ? (
                <ClipLoader
                  color={color}
                  loading={loading}
                  cssOverride={override}
                  size={30}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                "Sign in"
              )}
            </Button>
            <Button className="w-full flex items-center justify-center bg-green-400 py-2 px-4 rounded-lg shadow-md hover:bg-green-500 transition-colors"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
  <span className="mr-2">
    <FcGoogle className="w-6 h-6" />
  </span>
  <span>Sign In With Google</span>
</Button>

            <div className="flex justify-between items-center w-full my-2">
  <div>
    <Link className="mt-4 text-blue-300 hover:underline cursor-pointer" to="/forgotPassword">
      Forgot Password?
    </Link>
  </div>
  <div className="">
  <Link to="/tutorSignup"  className="mt-4 text-blue-300 hover:underline cursor-pointer" >
      Tutor Login?
    </Link>
  </div>
</div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Signin;
