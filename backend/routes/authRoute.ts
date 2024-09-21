import express from 'express';
import { auth,authSignin,authForgotPassword,authResetPassword,authWithGoogle,authSignOut,updateDetails,updatePasswordinStudentProfile,forgotPasswordInStudentProfile,verifyOtpAndResetPassword,GetAllCourses,getSingleCourse, getAllNotifications, deleteNotification, getAllCategory } from '../controllers/authController/authController';
import createMulterConfig from '../middleware/multer';
import authMiddleware from '../middleware/jwt';
import { VerifyUser } from '../middleware/VerifyUser';
import { getAllCategories } from '../controllers/adminController/AdminController';

const updateStudents= createMulterConfig('./backend/uploads/updateStudents');


const router = express.Router();

router.post('/signup',auth); 
router.post('/signin',authSignin)
router.post('/forgotPassword',authForgotPassword)
router.post("/resetPassword/:token", authResetPassword);
router.post("/google", authWithGoogle)
router.get('/signout',authSignOut)
router.put('/updateStudentDetails/:id',authMiddleware('student'),VerifyUser,updateStudents.single('profilePic'),updateDetails)
router.put('/updatePassword/:id',authMiddleware('student'),updatePasswordinStudentProfile)
router.post('/forgotPasswordInStudentProfile',forgotPasswordInStudentProfile)
router.post('/verifyOtpAndResetPassword',verifyOtpAndResetPassword)
router.get('/getAllCourses',authMiddleware('student'),VerifyUser,GetAllCourses)
router.get('/singleCourseDetail/:id',authMiddleware('student'),VerifyUser,getSingleCourse)
router.get('/getAllCategories',authMiddleware('student'),getAllCategory)
// router.get('/getAllCourseSinglePage',authMiddleware('student'),getAllCoursesSinglePage)
router.get('/getNotifications',authMiddleware('student'),getAllNotifications)
router.put('/deleteNotifications',authMiddleware('student'),deleteNotification)
   
export default router;
