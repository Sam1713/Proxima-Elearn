import express from "express";
const router=express.Router()
import {createCheckout, verifyPayment,OrderedCourses, getOrderedCourseDetail} from '../controllers/enrollementController/enrollementController'
import authMiddleware from "../middleware/jwt";

router.post('/checkout',authMiddleware('student'),createCheckout)
router.post('/verifyPayment',verifyPayment)
router.get('/getOrderedCourses',authMiddleware('student'),OrderedCourses)
router.get('/getOrderedCourseDetail/:id',authMiddleware('student'),getOrderedCourseDetail)
export default router