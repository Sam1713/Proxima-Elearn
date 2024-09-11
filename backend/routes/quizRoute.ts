import express from 'express'
import authMiddleware from '../middleware/jwt'
import { getQuizResult, postQuizResult, postQuizTutor } from '../controllers/quizController/quizController'
const router=express.Router()

router.post('/postQuiz',authMiddleware('tutor'),postQuizTutor)
router.post('/quizResult',authMiddleware('student'),postQuizResult)
router.get('/getQuizResult',authMiddleware('student'),getQuizResult)

export default router