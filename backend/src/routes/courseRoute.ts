import express from 'express'
const router=express.Router()
import createMulterConfig from '../middleware/multer';
import { uploadCourse,getTutorCourses,getTutorCourseDetail, updateCourseNonFileDetail, updateCoverImage, updateSubVideo, getAllPurchasedStudents, deleteCourse, getWalletDetails, getAllCategoryTutor, getSearchResultsCourse, getPriceBasedCourse, getCategorySort } from '../../src/controllers/courseController/courseController';
import authMiddleware from '../middleware/jwt';
const courseFilesUpload = createMulterConfig('./uploads/courseFiles');

router.post('/uploadCourse',authMiddleware('tutor'),courseFilesUpload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'coverVideo', maxCount: 1 },
    { name: 'videos', maxCount: 5},  
  ]),uploadCourse)
  router.get('/getTutorCourses',authMiddleware('tutor'),getTutorCourses)
  router.get('/getCategory',authMiddleware('tutor'),getAllCategoryTutor)
  router.get('/getTutorCourseDetail/:id',authMiddleware('tutor'),getTutorCourseDetail)
  router.put('/updateCourseNonFileDetails/:id',authMiddleware('tutor'),courseFilesUpload.single('none'),updateCourseNonFileDetail)
  router.patch('/updateCoverImage/:id',authMiddleware('tutor'),courseFilesUpload.single('coverImage'),updateCoverImage)
  router.patch('/updateSubVideo/:id',authMiddleware('tutor'),courseFilesUpload.single('subVideo'),updateSubVideo)
  router.get('/getPurchasedStudents',authMiddleware('tutor'),getAllPurchasedStudents)
  router.delete('/deleteCourse/:id',authMiddleware('tutor'),deleteCourse)
  router.get('/getWalletDetails',authMiddleware('tutor'),getWalletDetails)

  router.get('/getSearchCourse',authMiddleware('student'),getSearchResultsCourse)
  router.get('/getPricedCourses', authMiddleware('student'), getPriceBasedCourse);
  router.get('/getCategorySort',authMiddleware('student'),getCategorySort)
  
  export default router  