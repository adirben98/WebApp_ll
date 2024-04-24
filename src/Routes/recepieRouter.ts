import express from "express"
const recepieRouter = express.Router();
import recepieController from "../controllers/recepieController"
import {authMiddleware} from "../controllers/authController"


/**
* @swagger
* tags:
*   name: Recepie
*   description: The Recepie API
*/
/**
/**
 * @swagger
 * components:
 *   schemas:
 *     Recepie:
 *       type: object
 *       required:
 *         - name
 *         - author
 *         - category
 *         - ingredients
 *         - instructions
 *         - image
 *       properties:
 *         name:
 *           type: string
 *           description: The recipe name
 *         author:
 *           type: string
 *           description: The recipe author
 *         category:
 *           type: string
 *           description: The recipe category
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           description: The recipe ingredients
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *           description: The recipe instructions
 *         image:
 *           type: string
 *           description: The recipe image
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The recipe creation date
 *         likes:
 *           type: number
 *           description: The recipe likes
 *         likedBy:
 *           type: array
 *           items:
 *             type: string
 *           description: Users who liked the recipe
 *       example:
 *         name: "mac&cheese"
 *         author: "IDAN"
 *         category: "breakfast"
 *         ingredients:
 *           - "cheese"
 *           - "salt"
 *           - "pasta"
 *           - "cream"
 *         instructions:
 *           - "cook pasta"
 *           - "cook cream with salt"
 *           - "add all with cheese"
 *         image: "https://example.com/mac-and-cheese.jpg"
 *         likes: 0
 *         likedBy: []
 */


/**
 * @swagger
 * /recepie:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recepie
 *     summary: Create a new recepie
 *     description:  need to provide the access token in the auth header.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recepie'
 *     responses:
 *       200:
 *         description: The recepie was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recepie'
 */
recepieRouter.post("/",authMiddleware,recepieController.post.bind(recepieController))


/**
 * @swagger
 * /recepie/topFive:
 *   get:
 *     tags:
 *       - Recepie
 *     summary: Get top 5 recipes
 *     description: Retrieve the top 5 recipes based on some criteria (e.g., popularity, ratings)
 *     responses:
 *       200:
 *         description: An array of top 5 recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recepie'
 */

recepieRouter.get("/topFive",recepieController.getTopFive)

/**
 * @swagger
 * /recepie/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recepie
 *     summary: Get a recipe by id
 *     description:  need to provide the access token in the auth header.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The recipe id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A detailed view of the recipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recepie'
 */
recepieRouter.get("/:id",authMiddleware,recepieController.get.bind(recepieController))

/**
 * @swagger
 * /recepie/{id}/like:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recepie
 *     summary: Like a recipe
 *     description:  need to provide the access token in the auth header.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The recipe id to like
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The recipe was successfully liked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recepie'
 */
recepieRouter.post("/:id/like",authMiddleware,recepieController.likeIncrement.bind(recepieController))

/**
 * @swagger
 * /recepie/{id}/unlike:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recepie
 *     summary: Unlike a recipe
 *     description:  need to provide the refresh token in the auth header.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The recipe id to unlike
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The recipe was successfully unliked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recepie'
 */
recepieRouter.post("/:id/unlike",authMiddleware,recepieController.likeDincrement.bind(recepieController))


/**
 * @swagger
 * /recepie:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recepie
 *     summary: Edit a recipe
 *     description: Need to provide the refresh token in the auth header.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recepie'
 *     responses:
 *       200:
 *         description: The recipe was successfully edited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recepie'
 */
recepieRouter.put("/",authMiddleware,recepieController.edit.bind(recepieController))

/**
 * @swagger
 * /recepie:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recepie
 *     summary: Delete a recipe
 *     description: Need to provide the refresh token in the auth header.
 *     responses:
 *       200:
 *         description: The recipe was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recepie'
 */
recepieRouter.delete("/",authMiddleware,recepieController.delete.bind(recepieController))










export default recepieRouter;