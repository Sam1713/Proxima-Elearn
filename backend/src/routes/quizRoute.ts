import express from 'express'
import authMiddleware from '../../src/middleware/jwt'
import { deleteQuiz, getQuizResult, getQuizTutor, postQuizResult, postQuizTutor } from '../../src/controllers/quizController/quizController'
const router=express.Router()

router.post('/postQuiz',authMiddleware('tutor'),postQuizTutor)
router.get('/getQuiz',authMiddleware('tutor'),getQuizTutor)
router.post('/quizResult',authMiddleware('student'),postQuizResult)
router.get('/getQuizResult',authMiddleware('student'),getQuizResult)
router.delete('/deleteQuiz',authMiddleware('tutor'),deleteQuiz)

export default router