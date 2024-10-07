import express from 'express';
const router = express.Router();
import { AdminSignup,AdminSignin,GetAllTutors,GetTutorDetail,AdminApproveTutor,AdminRejectTutor,AdminUserListing,AdminBlockOrUnblock, addCategory, getAllCategories,updateCategory, getTutorCourses, getTutorCourseDetails,deleteCategory, adminSignout, getOrdersList, getAdminWalletDetails, getUserSearch, getOrderSearchVal } from '../controllers/adminController/AdminController';
import createMulterConfig from '../middleware/multer';
import authMiddleware from '../middleware/jwt';

const adminFiles= createMulterConfig('./uploads/admin');

router.post('/adminSignup',adminFiles.single('none'),AdminSignup)
router.post('/adminSignin',adminFiles.single('none'),AdminSignin)
router.get('/tutorlist',authMiddleware('admin'),GetAllTutors)
router.get('/tutorDetails/:id',authMiddleware('admin'),GetTutorDetail)
router.post('/approvetutor/:id',AdminApproveTutor)
router.post('/rejecttutor/:id',AdminRejectTutor)
router.get('/userlisting',authMiddleware('admin'),AdminUserListing)
router.put('/blockOrUnblock/:id',authMiddleware('admin'),AdminBlockOrUnblock)
router.post('/addCategory',authMiddleware('admin'),adminFiles.single('none'),addCategory)
router.get('/category',authMiddleware('admin'),getAllCategories)
router.put('/updateCategory/:id',authMiddleware('admin'),adminFiles.single('none'),updateCategory)
router.get('/getTutorCourses/:id',authMiddleware('admin'),getTutorCourses)
router.get('/tutorCourseDetail/:id',authMiddleware('admin'),getTutorCourseDetails)
router.delete('/deleteCategory/:id',authMiddleware('admin'),deleteCategory)
router.get('/adminSignout',adminSignout)
router.get('/getOrdersList',authMiddleware('admin'),getOrdersList)
router.get('/getWalletDetails',authMiddleware('admin'),getAdminWalletDetails)

router.get('/searchUser',authMiddleware('admin'),getUserSearch)
router.get('/getOrderSearchVal',authMiddleware('admin'),getOrderSearchVal)
export default router