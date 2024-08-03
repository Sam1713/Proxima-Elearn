// App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './headers/Header';
import LoadingSpinner from './utils/LoadingSpinner'; // Import the spinner component
import Layout from './layout/Layout';// Import your Layout component
import Mystudent from './components/studentAuth/Mystudent';

const Landing = React.lazy(() => import('./landing/Landing'));
const Register = React.lazy(() => import('./components/studentAuth/Register'));
const Signin = React.lazy(() => import('./components/studentAuth/Signin'));
const ForgotPassword = React.lazy(() => import('./components/studentAuth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./components/studentAuth/ResetPassword'));
const FeedHome = React.lazy(() => import('./components/feed/FeedHome'));
const TutorSignup = React.lazy(() => import('./components/tutorAuth/TutorSignup'));
const TutorSignin = React.lazy(() => import('./components/tutorAuth/TutorSignin'));
const TutorWaiting = React.lazy(() => import('./components/tutorAuth/TutorWaiting'));
const StudentProfileDetails = React.lazy(() => import('./components/studentAuth/StudentProfileDetails'));
// Import other components as needed

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route path="/studentProfile" element={<StudentProfileDetails />} />
            <Route path="/myStudent"element={<Mystudent/>}/>
            {/* Add more routes as needed */}
          </Route>
          {/* Add other routes for public and tutor pages */}
          <Route path="/signup" element={<Register />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/feedHome" element={<FeedHome />} />
          <Route path="/tutorSignup" element={<TutorSignup />} />
          <Route path="/tutorSignin" element={<TutorSignin />} />
          <Route path="/tutorWait" element={<TutorWaiting />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
