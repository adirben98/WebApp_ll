import express from "express"
const commentRouter = express.Router();
import commentController from "../controllers/commentController"
import {authMiddleware} from "../controllers/authController"

/**
* @swagger
* tags:
*   name: Comment
*   description: The Comment API
*/
/**
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - author
 *         - recepieId
 *       properties:
 *         content:
 *           type: string
 *           description: The comment content
 *         author:
 *           type: string
 *           description: The comment author
 *         recepieId:
 *           type: string
 *           description: The comment recipe id
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The comment creation date
 *       example:
 *         content: "that is a great recipe"
 *         author: "Idan the builder"
 *         recepieId: "66296a8f1c761284e4a12434"
 *         createdAt: "2022-01-01T00:00:00.000Z"
 */


/**
 * @swagger
 * /comment/{recepieId}:
 *   get:
 *     summary: Get comments by recipe id
 *     description: Need to provide the access token in the auth header.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recepieId
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe id
 *     responses:
 *       200:
 *         description: The comments by recipe id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
commentRouter.get("/:recepieId",authMiddleware,commentController.get.bind(commentController))     

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Post a comment
 *     description: Need to provide the access token in the auth header.
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: The comment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
commentRouter.post("/",authMiddleware,commentController.post.bind(commentController))

/**
 * @swagger
 * /comment:
 *   put:
 *     summary: Edit a comment
 *     description: Need to provide the access token in the auth header.
 *     tags: [Comment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The comment was successfully edited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
commentRouter.put("/",authMiddleware,commentController.edit.bind(commentController))

/**
 * @swagger
 * /comment:
 *   delete:
 *     summary: Delete a comment
 *     description: Need to provide the access token in the auth header.
 *     tags: [Comment]
 *     responses:
 *       200:
 *         description: The comment was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
commentRouter.delete("/",authMiddleware,commentController.delete.bind(commentController))












export default commentRouter;