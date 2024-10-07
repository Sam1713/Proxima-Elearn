import express from 'express'
import authMiddleware from '../../src/middleware/jwt'
import {  getStudentDetails, getTutorList, postStudentMessage,getStudentChat, getOldChatsInStudent, postTutorMessage } from '../../src/controllers/chatController/chatController'
const router=express.Router()

router.get('/getTutorList',authMiddleware('student'),getTutorList)
router.post('/sendMessage',authMiddleware('student'),postStudentMessage)
router.get('/getStudentDetails',authMiddleware('tutor'),getStudentDetails)
router.get('/getStudentChat',authMiddleware('tutor'),getStudentChat)
router.get('/getOldChats',authMiddleware('student'),getOldChatsInStudent)
router.post('/sendMessageToStudent',authMiddleware('tutor'),postTutorMessage)
export default router