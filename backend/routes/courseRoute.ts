import express from 'express'
const router=express.Router()
import createMulterConfig from '../middleware/multer';
import { uploadCourse } from '../controllers/courseController/courseController';
import authMiddleware from '../middleware/jwt';
const courseFilesUpload = createMulterConfig('./backend/uploads/courseFiles');

router.post('/uploadCourse',authMiddleware('tutor'),courseFilesUpload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'coverVideo', maxCount: 1 },
    { name: 'videos', maxCount: 5},  // Handle an array of video files, with a limit of 10
  ]),uploadCourse)

export default router