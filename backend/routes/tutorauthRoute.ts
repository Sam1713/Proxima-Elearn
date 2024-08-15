import express from 'express';
import upload from '../middleware/multer';
import { tutorSignup,tutorSignin,getTutorHome,TutorWait,sendOtpTutor,verifyOtp,updateTutor,updateBio,updateFiles,acceptLicense } from '../controllers/tutorAuthController/tutorAuthController';
import createMulterConfig from '../middleware/multer';
import authMiddleware from '../middleware/jwt';
import tutorApprove from '../middleware/tutorApprove';

const tutorFilesUpload = createMulterConfig('./backend/uploads/tutorFiles');

const router = express.Router();

router.post('/tutorsignup', tutorFilesUpload.array('files'), tutorSignup);
router.post('/tutorsignin',tutorSignin)
router.get('/tutorwait',authMiddleware('tutor'),tutorApprove,TutorWait)
router.get('/tutorhome',authMiddleware('tutor'),tutorApprove,getTutorHome)
router.post('/sendOtp',sendOtpTutor)
router.post('/verifyOtp',verifyOtp)
router.put('/updateTutor',authMiddleware('tutor'),tutorFilesUpload.single('none'),updateTutor)
router.put('/updateBio',authMiddleware('tutor'),updateBio)
router.post('/updateFiles',authMiddleware('tutor'),tutorFilesUpload.array('files'),updateFiles)
// router.delete('/deleteFile',authMiddleware('tutor'),deleteFile)
router.post('/acceptLicense',authMiddleware('tutor'),acceptLicense)
export default router;
