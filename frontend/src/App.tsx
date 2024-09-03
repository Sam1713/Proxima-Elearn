// App.js
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route,ScrollRestoration } from 'react-router-dom';
import LoadingSpinner from './utils/LoadingSpinner';
import Layout from './layout/Layout';
import Mystudent from './components/studentAuth/Mystudent';
import StudentPrivateRoute from './utils/PrivateRoute'; 
import StudentPublicRoute from './utils/StudentPublicRoute';
import StudentLayout from './layout/StudentLayout';
import AdminLayout from './layout/AdminLayout';
import AdminLoginLayout from './layout/AdminLoginLayout';
import AdminLogin from './components/admin/AdminLogin';
import TutorListing from './components/admin/TutorListing';
import AdminPrivateRoute from './utils/AdminPrivateRoute';
import AdminPublicRoute from './utils/AdminPublicRoute';
import TutorDetails from './components/admin/TutorDetails';
import TutorHome from './components/tutorAuth/TutorHome';
import TutorPrivateRoute from './utils/TutorPrivateRoute';
import TutorPublicRoute from './utils/TutorPublicRoute';
import UserListing from './components/admin/UserListing';
import TutorLayout from './layout/TutorLayout';
import TutorSidebar from './layout/TutorSidebar';
import TutorProfile from './components/tutorAuth/TutorProfile';
import CoursePage from './components/courses/CoursePage';
import CourseDetails from './components/studentCourse/CourseDetails';
import Courses from './components/studentCourse/Courses';
import SingleCourseDetail from './components/studentCourse/SingleCourseDetail';
import Checkout from './components/studentCourse/Checkout';
import OrderedCourse from './components/studentCourse/OrderedCourse';
import AdminCategory from './components/admin/AdminCategory';
import PaymentInfo from './components/studentCourse/PaymentInfo';
import GetTutorCourses from './components/courses/GetTutorCourses';
import GetTutorCourseDetail from './components/courses/GetTutorCourseDetail';
import PurchasedStudent from './components/courses/PurchasedStudent';
import AllCourses from './components/studentCourse/AllCourses';
import TutorCourses from './components/admin/TutorCourses';
import TutorCourseDetails from './components/admin/TutorCourseDetails';
import BookingCall from './components/studentCourse/BookingCall';
import GetCallRequest from './components/courses/GetCallRequest';
import FullCallDetails from './components/courses/FullCallDetails';
import socketIO from 'socket.io-client'
import Room from './components/room/Room';
import { ContextProvider, SocketContext } from './components/context/RoomContext';
import OpenRoom from './components/room/OpenRoom';
import OrdersList from './components/admin/OrdersList';
import TutorWallet from './components/courses/TutorWallet';

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


function App() {
  const student = localStorage.getItem('access_token');
  const tutor = localStorage.getItem('tutor_access_token');

  const isAuthorized = student || tutor;
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<StudentLayout />}>
            <Route element={<StudentPrivateRoute />}>
              <Route element={<Layout />}>

                <Route path="/studentProfile" element={<StudentProfileDetails />} />
                <Route path="/myStudent" element={<Mystudent />} />
                <Route path='/orderedCourses'element={<OrderedCourse/>}/>
                <Route path='/getPaymentDetails'element={<PaymentInfo/>}/>
                </Route>
                <Route path="/feedHome" element={<FeedHome />} />
                <Route path='/courseDetail/:id'element={<CourseDetails/>}/>
                <Route path='/courses'element={<Courses/>}/>
                <Route path='/singleCourseDetail/:id'element={<SingleCourseDetail/>}/>
                <Route path='/checkout'element={<Checkout/>}/>
                <Route path='/allCourses'element={<AllCourses/>}/>
                <Route path='/booking/:id'element={<BookingCall/>}/>
                {/* <Route path="/room/:id" element={
                <Room/>
                  
                  }/>  */}
                
            </Route>
                         {/* <Route path='/openRoom'element={<OpenRoom/>}/> */}

            <Route element={<StudentPublicRoute />}>
            <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
            </Route>
          </Route>
          <Route element={<TutorLayout/>}>
          <Route element={<TutorPublicRoute/>}>
          <Route path="/tutorSignup" element={<TutorSignup />} />
          <Route path="/tutorSignin" element={<TutorSignin />} />
          <Route path="/tutorWait" element={<TutorWaiting />} />
          </Route>
          <Route element={<TutorPrivateRoute/>}>  
             <Route path='/tutorhome'element={<TutorHome/>}/>
             <Route path='/tutorprofile'element={<TutorProfile/>}/>
             <Route path='/coursepage'element={<CoursePage/>}/>
             <Route path='/getTutorCourses'element={<GetTutorCourses/>}/>
             <Route path='/getTutorCourseDetail/:id'element={<GetTutorCourseDetail/>}/>
             <Route path='/purchasedStudents'element={<PurchasedStudent/>}/>
             <Route path='/getFullCallDetails/:id'element={<FullCallDetails/>}/>

             <Route path='/getCallList'element={<GetCallRequest/>}/>
             <Route path='/tutorWallet'element={<TutorWallet/>}/>
             {/* <Route path="/room/:id" element={
            
              <Room/>
              
              }/> */}
             </Route>   
             {/* <Route path='/openRoom'element={<OpenRoom/>}/> */}
             {isAuthorized && (
            <Route path="/room/:id" element={<Room />} />
          )}
             </Route>  
          <Route element={<AdminLoginLayout />}>
          <Route element={<AdminPublicRoute/>}>
            <Route path='/admin/adminLogin' element={<AdminLogin />} />
            </Route>
          </Route>
          <Route element={<AdminLayout />}>
            <Route element={<AdminPrivateRoute />}>
              <Route path='/admin/tutorlist' element={<TutorListing />} />
              <Route path='/admin/tutorDetails/:id' element={<TutorDetails />} />
              <Route path='/admin/userlisting'element={<UserListing/>}/>
              <Route path='/admin/category'element={<AdminCategory/>}/>
              <Route path='/admin/tutorCourses/:id'element={<TutorCourses/>}/>
              <Route path='/admin/tutorCourseDetail/:id'element={<TutorCourseDetails/>}/>
              <Route path='/admin/ordersList'element={<OrdersList/>}/>
            </Route>
          </Route>
        </Routes>
        
      </Suspense> 
    </BrowserRouter>
  );
}

export default App;
