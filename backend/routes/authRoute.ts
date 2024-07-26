import express from 'express';
import { auth,authSignin } from '../controllers/authController/authController';

const router = express.Router();

router.post('/signup',auth);
router.post('/signin',authSignin)
  
export default router;
