import express from 'express';
import { getCallData, getCallRequest, getFullCallDetails, leaveCall, sendIdToStudent, tutorApproveRequest, videoCallBooking } from '../../src/controllers/contactController/contactController';
import multer from "multer";
import authMiddleware from '../../src/middleware/jwt';
const upload=multer()

const router=express.Router()


router.post('/bookCall',authMiddleware('student'),upload.any(),videoCallBooking)
router.get('/getCallRequest',authMiddleware('tutor'),getCallRequest)
router.post('/approveRequest',authMiddleware('tutor'),upload.any(),tutorApproveRequest)
router.get('/getFullCallDetails/:id',authMiddleware('tutor'),getFullCallDetails)
router.get('/getCallData/:id',authMiddleware('student'),getCallData)
router.post('/sendId',authMiddleware('tutor'),sendIdToStudent)
router.get('/leavecall',authMiddleware('tutor'),leaveCall)
export default router   