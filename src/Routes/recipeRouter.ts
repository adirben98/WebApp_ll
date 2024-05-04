import express from "express"
const recipeRouter = express.Router();
import recipeController from "../controllers/recipeController"
import {authMiddleware} from "../controllers/authController"
import getFiveRandomRecipe from "../controllers/restApi"


/**
* @swagger
* tags:
*   name: Recipe
*   description: The Recipe API
*/
/**
/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - ingredients
 *         - instructions
 *         - image
 *       properties:
 *         name:
 *           type: string
 *           description: The recipe name
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
 * /recipe:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Create a new Recipe
 *     description:  need to provide the access token in the auth header.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: The recipe was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 */
recipeRouter.post("/",authMiddleware,recipeController.post.bind(recipeController))


/**
 * @swagger
 * /recipe/topFive:
 *   get:
 *     tags:
 *       - Recipe
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
 *                 $ref: '#/components/schemas/Recipe'
 */

recipeRouter.get("/topFive",recipeController.getTopFive)

/**
 * @swagger
 * /recipe/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
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
 *               $ref: '#/components/schemas/Recipe'
 */
recipeRouter.get("/:id",authMiddleware,recipeController.get.bind(recipeController))

/**
 * @swagger
 * /recipe/{id}/like:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
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
 *               $ref: '#/components/schemas/Recipe'
 */
recipeRouter.post("/:id/like",authMiddleware,recipeController.likeIncrement.bind(recipeController))

/**
 * @swagger
 * /recipe/{id}/unlike:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Unlike a recipe
 *     description:  need to provide the access token in the auth header.
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
 *               $ref: '#/components/schemas/Recipe'
 */
recipeRouter.post("/:id/unlike",authMiddleware,recipeController.likeDincrement.bind(recipeController))


/**
 * @swagger
 * /recipe:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Edit a recipe
 *     description: Need to provide the access token in the auth header. Also, provide the recipe id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *           examples:
 *             recipeEditExample:
 *               value:
 *                 _id: "123124143"
 *                 name: "mac&cheese"
 *                 category: "dinner"
 *                 ingredients: ["cheese", "salt", "pasta", "cream", "pepper", "onion"]
 *                 instructions: ["cook pasta", "cook cream with salt", "add all with cheese", "add pepper and onion"]
 *                 image: "https://example.com/mac-and-cheese.jpg"
 * 
 *     responses:
 *       200:
 *         description: The recipe was successfully edited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 */

recipeRouter.put("/",authMiddleware,recipeController.edit.bind(recipeController))

/**
 * @swagger
 * /recipe/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *     summary: Delete a recipe
 *     description: Need to provide the access token in the auth header.
 *     responses:
 *       200:
 *         description: The recipe was successfully deleted!
 */
recipeRouter.delete("/:id",authMiddleware,recipeController.delete.bind(recipeController))



export default recipeRouter;
