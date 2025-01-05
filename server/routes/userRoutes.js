import express from 'express';
import { acceptFriendRequest, getAllFriends, getFriendRequests, loginController, registerController, searchUsers, sendFriendRequest, suggestFriends } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register',registerController);
router.post('/login', loginController);
router.get("/search",protect, searchUsers);
router.get("/all-friends", protect, getAllFriends)
router.get('/friend-requests',protect,getFriendRequests)
router.get('/suggestions',protect,suggestFriends)
router.post('/send-friend-request',protect, sendFriendRequest);
router.post('/accept-friend-request', protect, acceptFriendRequest);

export default router;