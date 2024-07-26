"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentRouter = express_1.default.Router();
const commentController_1 = __importDefault(require("../controllers/commentController"));
const authController_1 = require("../controllers/authController");
/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: The Comment API
 */
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
 *         author: "User123"
 *         recipeid: "123124143"
 *         createdAt: "2023-07-15T19:20:30Z"
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
commentRouter.get("/:recipeId", authController_1.authMiddleware, commentController_1.default.get.bind(commentController_1.default));
/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Post a comment
 *     description: Need to provide the access token in the auth header. Also, provide the recipe id you comment for.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
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
commentRouter.post("/", authController_1.authMiddleware, commentController_1.default.post.bind(commentController_1.default));
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
 *     responses:
 *       200:
 *         description: The comment was successfully edited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
commentRouter.put("/", authController_1.authMiddleware, commentController_1.default.edit.bind(commentController_1.default));
/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Need to provide the access token in the auth header.
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment id
 *     responses:
 *       200:
 *         description: The comment was successfully deleted!
 */
commentRouter.delete("/:id", authController_1.authMiddleware, commentController_1.default.delete.bind(commentController_1.default));
exports.default = commentRouter;
//# sourceMappingURL=commentRouter.js.map