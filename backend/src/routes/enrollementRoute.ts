import express from "express";
const router=express.Router()
import {createCheckout, verifyPayment,OrderedCourses, getOrderedCourseDetail,getPaymentDetails} from '../controllers/enrollementController/enrollementController'
import authMiddleware from "../middleware/jwt";
import { VerifyUser } from "../middleware/VerifyUser";

router.post('/checkout',authMiddleware('student'),createCheckout)
router.post('/verifyPayment',verifyPayment)
router.get('/getOrderedCourses',authMiddleware('student'),VerifyUser,OrderedCourses)
router.get('/getOrderedCourseDetail/:id',authMiddleware('student'),VerifyUser,getOrderedCourseDetail)
router.get('/getPaymentDetails',authMiddleware('student'),VerifyUser,getPaymentDetails)
export default router 