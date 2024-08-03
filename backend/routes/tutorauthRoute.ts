import express from 'express';
import upload from '../middleware/multer';
import { tutorSignup,tutorSignin } from '../controllers/tutorAuthController/tutorAuthController';
import createMulterConfig from '../middleware/multer';

const tutorFilesUpload = createMulterConfig('./backend/uploads/tutorFiles');

const router = express.Router();

router.post('/tutorsignup', tutorFilesUpload.array('files'), tutorSignup);
router.post('/tutorsignin',tutorSignin)
export default router;
