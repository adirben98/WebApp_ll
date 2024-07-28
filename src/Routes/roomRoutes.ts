import express from 'express';
import { checkRoom, createRoom, getMessages } from '../controllers/roomController';

const router = express.Router();

router.get('/:roomId', checkRoom);
router.post('/', createRoom);
router.get('/:roomId/messages', getMessages);

export default router;
