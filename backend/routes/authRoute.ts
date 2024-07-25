import express from 'express';
import { auth } from '../controllers/authController/authController';

const router = express.Router();

router.get('/signup', auth);

export default router;
