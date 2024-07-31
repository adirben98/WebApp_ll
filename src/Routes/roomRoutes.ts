import express from 'express';
const router = express.Router();
import { authMiddleware } from '../controllers/authController';
import { checkRoom, createRoom, getMessages, getMyRooms } from '../controllers/roomController';

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - roomId
 *         - user1
 *         - user2
 *       properties:
 *         roomId:
 *           type: string
 *           description: Unique identifier for the room
 *         user1:
 *           type: string
 *           description: First user in the room
 *         user2:
 *           type: string
 *           description: Second user in the room
 *         messagesArray:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of message IDs associated with the room
 *     Message:
 *       type: object
 *       required:
 *         - roomId
 *         - username
 *         - message
 *       properties:
 *         roomId:
 *           type: string
 *           description: ID of the room
 *         username:
 *           type: string
 *           description: Username of the sender
 *         message:
 *           type: string
 *           description: Content of the message
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the message was sent
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management
 */

/**
 * @swagger
 * /rooms/check/{roomId}:
 *   get:
 *     summary: Check if the room exists
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: The room ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Room status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 */
router.get('/check/:roomId', authMiddleware, checkRoom);

/**
 * @swagger
 * /rooms/create:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Room created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 */
router.post('/create', authMiddleware, createRoom);

/**
 * @swagger
 * /rooms/{roomId}/messages:
 *   get:
 *     summary: Retrieve messages for a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: The room ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
router.get('/:roomId/messages', authMiddleware, getMessages);

/**
 * @swagger
 * /rooms/getmyrooms:
 *   get:
 *     summary: Get rooms for the authenticated user
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   otherUser:
 *                     type: string
 *                   roomId:
 *                     type: string
 */
router.get('/getmyrooms', authMiddleware, getMyRooms);

export default router;
