import express from 'express';
import { loginUser, logoutUser, signUp } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signUp)


router.post('/login' , loginUser)

router.post('/logout' , verifyJWT, logoutUser)


export default router;