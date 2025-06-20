import express from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import {
    acceptFriendRequest,
    getFriendRequest,
    getMyFriends,
    getOutgoingFriendRequest,
    getrecommendedUsers,
    sendFriendRequest
} from '../controllers/user.controller.js';

const router = express.Router();

// apply auth middleware to all routes
router.use(verifyJWT)

router.get("/", getrecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequest);
router.get("/outgoing-friend-requests", getOutgoingFriendRequest);


export default router;