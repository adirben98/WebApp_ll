import express from 'express';
import { checkRoom, createRoom, getMessages, getMyRooms } from '../controllers/roomController';
import { authMiddleware } from '../controllers/authController';

const router = express.Router();

router.get('/check/:roomId', authMiddleware,checkRoom);
router.post('/create',authMiddleware, createRoom);
router.get('/:roomId/messages',authMiddleware, getMessages);
router.get('/getmyrooms',authMiddleware, getMyRooms);

export default router;
