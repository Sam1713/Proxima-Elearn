import express from 'express'
const router=express.Router()
import { feedPost,getFeedPage } from '../controllers/feedController/feedController'
import upload from '../middleware/multer'
import createMulterConfig from '../middleware/multer';
import authMiddleware from '../middleware/jwt';

const feedFilesUpload = createMulterConfig('./backend/uploads/feedFiles');


router.post('/feedPost',authMiddleware('student'),feedFilesUpload.array('files'),feedPost)
router.get('/getFeed',authMiddleware('student'),getFeedPage)

export default router 