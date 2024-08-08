import express from 'express';
const router = express.Router();
import { AdminSignup,AdminSignin,GetAllTutors,GetTutorDetail,AdminApproveTutor,AdminRejectTutor,AdminUserListing } from '../controllers/adminController/AdminController';
import createMulterConfig from '../middleware/multer';
import authMiddleware from '../middleware/jwt';

const adminFiles= createMulterConfig('./backend/uploads/admin');

router.post('/adminSignup',adminFiles.single('none'),AdminSignup)
router.post('/adminSignin',adminFiles.single('none'),AdminSignin)
router.get('/tutorlist',authMiddleware('admin'),GetAllTutors)
router.get('/tutorDetails/:id',authMiddleware('admin'),GetTutorDetail)
router.post('/approvetutor/:id',AdminApproveTutor)
router.post('/rejecttutor/:id',AdminRejectTutor)
router.get('/userlisting',authMiddleware('admin'),AdminUserListing)

export default router