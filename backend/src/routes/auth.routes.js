import express from 'express';
import {
    loginUser,
    logoutUser,
    onBoarding,
    signUp
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signUp)


router.post('/login', loginUser)

router.post('/logout', verifyJWT, logoutUser)

router.post('/onboarding', verifyJWT, onBoarding)

// check if user is logged in or not 
router.get('/me', verifyJWT, (req, res) => {
    res.status(200).json({ success : true, user: req.user });
})


export default router;