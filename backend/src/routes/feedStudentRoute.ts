import express from 'express'
const router=express.Router()
import { feedPost,getFeedPage } from '../../src/controllers/feedController/feedController'
import upload from '../../src/middleware/multer'
import createMulterConfig from '../../src/middleware/multer';
import authMiddleware from '../../src/middleware/jwt';
import { VerifyUser } from '../../src/middleware/VerifyUser';

const feedFilesUpload = createMulterConfig('./uploads/feedFiles');


router.post('/feedPost',authMiddleware('student'),feedFilesUpload.array('files'),feedPost)
router.get('/getFeed',authMiddleware('student'),VerifyUser,getFeedPage)

export default router 