import express from 'express';
import upload from '../../src/middleware/multer';
import { tutorSignup,tutorSignin,getTutorHome,TutorWait,sendOtpTutor,verifyOtp,updateTutor,updateBio,updateFiles,acceptLicense, tutorSignout} from '../../src/controllers/tutorAuthController/tutorAuthController';
import createMulterConfig from '../../src/middleware/multer';
import authMiddleware from '../../src/middleware/jwt';
import tutorApprove from '../../src/middleware/tutorApprove';

const tutorFilesUpload = createMulterConfig('./uploads/tutorFiles');

const router = express.Router();

router.post('/tutorsignup', tutorFilesUpload.array('files'), tutorSignup);
router.post('/tutorsignin',tutorSignin)
router.get('/tutorwait',authMiddleware('tutor'),tutorApprove,TutorWait)
router.get('/tutorhome',authMiddleware('tutor'),tutorApprove,getTutorHome)
router.post('/sendOtp',sendOtpTutor)
router.post('/verifyOtp',verifyOtp)
router.get('/tutorSignout',tutorSignout)
router.put('/updateTutor',authMiddleware('tutor'),tutorFilesUpload.single('none'),updateTutor)
router.put('/updateBio',authMiddleware('tutor'),updateBio)
router.post('/updateFiles',authMiddleware('tutor'),tutorFilesUpload.array('files'),updateFiles)
// router.delete('/deleteFile',authMiddleware('tutor'),deleteFile)
router.post('/acceptLicense',authMiddleware('tutor'),acceptLicense)
export default router; 
 