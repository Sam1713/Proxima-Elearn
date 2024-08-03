import React, { useState } from "react";
import oipImage from "../../assets/images/1175458.jpg";
import { SigninType } from "../../types/Register";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { override, color } from "../../utils/ClipLoader";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signInFailure } from "../../redux/student/studentSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";

const Signin: React.FC = () => {
  const [form, setForm] = useState<SigninType>({ email: "", password: "" });
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: any) => state.student);
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const response = await axios.post("/backend/auth/signin", form, {
        withCredentials: true,
        credentials:'include'
      });
      localStorage.setItem('access_token', response.data.token);
      console.log('Token saved:', localStorage.getItem('access_token'));

      
      dispatch(signInSuccess(response.data.rest));
      toast.success(response.data.message);
      navigate('/feedHome');
    } catch (error: unknown) {
      console.error('Error caught:', error);
      dispatch(signInFailure(error));
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex h-screen shadow-2xl items-center justify-center p-4 bg-cover bg-center"
         style={{ backgroundImage: "url('https://cdn.wallpapersafari.com/24/93/1d9UAi.jpg')" }}>
      <ToastContainer />
      <div className="flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        <div className="flex-1 flex items-center justify-center p-4">
          <img src={oipImage} alt="Signin Background" className="object-cover w-full h-full" />
        </div>
        <div className="flex-1 flex items-center justify-center p-4 mx-[-11%]">
          <form onSubmit={handleSubmit}
                className="w-full max-w-sm p-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                onChange={handleChange}
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                onChange={handleChange}
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
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
            </button>
            <Link className="mt-4 text-center text-blue-300 hover:underline cursor-pointer"
                  to={"/forgotPassword"}>
              Forgot Password?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
