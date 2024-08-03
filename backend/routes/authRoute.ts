import express from 'express';
import { auth,authSignin,authForgotPassword,authResetPassword,authWithGoogle,authSignOut,updateDetails,updatePasswordinStudentProfile,forgotPasswordInStudentProfile,verifyOtpAndResetPassword } from '../controllers/authController/authController';
import createMulterConfig from '../middleware/multer';
import authMiddleware from '../middleware/jwt';

const updateStudents= createMulterConfig('./backend/uploads/updateStudents');


const router = express.Router();

router.post('/signup',auth);
router.post('/signin',authSignin)
router.post('/forgotPassword',authForgotPassword)
router.post("/resetPassword/:token", authResetPassword);
router.post("/google", authWithGoogle)
router.get('/signout',authSignOut)
router.put('/updateStudentDetails/:id',authMiddleware,updateStudents.single('profilePic'),updateDetails)
router.put('/updatePassword/:id',authMiddleware,updatePasswordinStudentProfile)
router.post('/forgotPasswordInStudentProfile',forgotPasswordInStudentProfile)
router.post('/verifyOtpAndResetPassword',verifyOtpAndResetPassword)

  
export default router;
