import express from 'express'
const router=express.Router()
import createMulterConfig from '../middleware/multer';
import { uploadCourse,getTutorCourses,getTutorCourseDetail, updateCourseNonFileDetail, updateCoverImage, updateSubVideo, getAllPurchasedStudents, deleteCourse } from '../controllers/courseController/courseController';
import authMiddleware from '../middleware/jwt';
const courseFilesUpload = createMulterConfig('./backend/uploads/courseFiles');

router.post('/uploadCourse',authMiddleware('tutor'),courseFilesUpload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'coverVideo', maxCount: 1 },
    { name: 'videos', maxCount: 5},  // Handle an array of video files, with a limit of 10
  ]),uploadCourse)
  router.get('/getTutorCourses',authMiddleware('tutor'),getTutorCourses)
  router.get('/getTutorCourseDetail/:id',authMiddleware('tutor'),getTutorCourseDetail)
  router.put('/updateCourseNonFileDetails/:id',authMiddleware('tutor'),courseFilesUpload.single('none'),updateCourseNonFileDetail)
  router.patch('/updateCoverImage/:id',authMiddleware('tutor'),courseFilesUpload.single('coverImage'),updateCoverImage)
  router.patch('/updateSubVideo/:id',authMiddleware('tutor'),courseFilesUpload.single('subVideo'),updateSubVideo)
  router.get('/getPurchasedStudents',authMiddleware('tutor'),getAllPurchasedStudents)
  router.delete('/deleteCourse/:id',authMiddleware('tutor'),deleteCourse)
  export default router  