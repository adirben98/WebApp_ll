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
 *         - recipeid
 *       properties:
 *         content:
 *           type: string
 *           description: The comment content
 *         author:
 *           type: string
 *           description: The comment author
 *         recipeid:
 *           type: string
 *           description: The comment recipe id
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The comment creation date
 *       example:
 *         content: "that is a great recipe"
 *         recipeId: "123124143"
 *    
 *         
 */


/**
 * @swagger
 * /comment/{recipeId}:
 *   get:
 *     summary: Get comments by recipe id
 *     description: Need to provide the access token in the auth header.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
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
commentRouter.get("/:recipeId",authMiddleware,commentController.get.bind(commentController))     

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Post a comment
 *     description: Need to provide the access token in the auth header. Also, provide the recipe id you comment for.
 *     tags: [Comment]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     example:
 *       content: "that is a great recipe"
 *       recipeId: "123124143"
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
 *     description: Need to provide the access token in the auth header. Also, provide the comment id and the new content.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *           examples:
 *             commentEditExample:
 *               value:
 *                 _id: "123124143"
 *                 content: "just edited my comment"
 *
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
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Need to provide the access token in the auth header.
 *     tags: [Comment]
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *     responses:
 *       200:
 *         description: The comment was successfully deleted!
 */
commentRouter.delete("/:id",authMiddleware,commentController.delete.bind(commentController))












export default commentRouter;