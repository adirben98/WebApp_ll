import express from "express";
const recipeRouter = express.Router();
import recipeController from "../controllers/recipeController";
import { authMiddleware } from "../controllers/authController";
import restApiController from "../controllers/restApi";

/**
 * @swagger
 * tags:
 *   name: Recipe
 *   description: The Recipe API
 */
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
 *         name: "Spaghetti Carbonara"
 *         author: "John Doe"
 *         category: "Italian"
 *         ingredients:
 *           - "spaghetti"
 *           - "eggs"
 *           - "pancetta"
 *           - "parmesan cheese"
 *           - "black pepper"
 *         instructions:
 *           - "Cook spaghetti according to package instructions."
 *           - "In a separate pan, cook pancetta until crispy."
 *           - "Whisk eggs and Parmesan together in a bowl."
 *           - "Combine spaghetti, pancetta, and egg mixture."
 *           - "Season with black pepper and serve."
 *         image: "https://example.com/spaghetti-carbonara.jpg"
 *         likes: 5
 *         likedBy: ["user1", "user2"]
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
 *     description: Need to provide the access token in the auth header.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: The recipe was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input
 */
recipeRouter.post("/", authMiddleware, recipeController.post.bind(recipeController));
recipeRouter.get("/randomRESTApi", authMiddleware, restApiController.getFiveRandomRecipe)
recipeRouter.get("/", authMiddleware, recipeController.getAll.bind(restApiController));


/**
 * @swagger
 * /recipe/getCategories:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Get all recipe categories
 *     description: Retrieve a list of all recipe categories.
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Failed to fetch categories
 */
recipeRouter.get("/getCategories", authMiddleware, restApiController.getCategories);

/**
 * @swagger
 * /recipe/getUserRecipesAndFavorites:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Get user's recipes and favorites
 *     description: Retrieve a list of recipes created by the user and their favorite recipes.
 *     responses:
 *       200:
 *         description: User's recipes and favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *                 favorites:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Failed to fetch user's recipes and favorites
 */
recipeRouter.get("/getUserRecipesAndFavorites/:name", authMiddleware, recipeController.getUserRecipesAndFavorites.bind(recipeController));

/**
 * @swagger
 * /recipe/search:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Search recipes
 *     description: Search for recipes based on a query string.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: The search query
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Error performing search
 */
recipeRouter.get("/search", authMiddleware, recipeController.search.bind(recipeController));

/**
 * @swagger
 * /recipe/categorySearch/{name}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Search recipes by category
 *     description: Retrieve recipes by category name.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The category name
 *     responses:
 *       200:
 *         description: Recipes in the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Error performing search
 */
recipeRouter.get("/categorySearch/:name", authMiddleware, restApiController.categorySearch.bind(recipeController));
recipeRouter.get("/recipeFromApi/:name", authMiddleware, restApiController.categorySearch.bind(recipeController));

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
 *       400:
 *         description: Failed to fetch top recipes
 */
recipeRouter.get("/topFive", recipeController.getTopFive);

/**
 * @swagger
 * /recipe/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Get a recipe by id
 *     description: Need to provide the access token in the auth header.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe id
 *     responses:
 *       200:
 *         description: A detailed view of the recipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 *       400:
 *         description: Failed to fetch recipe
 */
recipeRouter.get("/:id", authMiddleware, recipeController.get.bind(recipeController));

/**
 * @swagger
 * /recipe/isLiked/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Check if the recipe is liked
 *     description: Need to provide the access token in the auth header.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The recipe id to check
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The recipe was successfully liked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Failed to check if recipe is liked
 */
recipeRouter.get("/isLiked/:id", authMiddleware, recipeController.isLiked.bind(recipeController));

/**
 * @swagger
 * /recipe/{id}/like:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Like a recipe
 *     description: Need to provide the access token in the auth header.
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
 *       400:
 *         description: You have already liked this recipe
 *       404:
 *         description: Recipe not found
 */
recipeRouter.post("/like/:id", authMiddleware, recipeController.likeIncrement.bind(recipeController));

/**
 * @swagger
 * /recipe/{id}/unlike:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Unlike a recipe
 *     description: Need to provide the access token in the auth header.
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
 *       400:
 *         description: You haven't liked this recipe yet
 *       404:
 *         description: Recipe not found
 */
recipeRouter.post("/unlike/:id", authMiddleware, recipeController.likeDecrement.bind(recipeController));

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
 *                 name: "Spaghetti Carbonara"
 *                 category: "dinner"
 *                 ingredients: ["spaghetti", "eggs", "pancetta", "parmesan cheese", "black pepper"]
 *                 instructions: ["Cook spaghetti according to package instructions.", "In a separate pan, cook pancetta until crispy.", "Whisk eggs and Parmesan together in a bowl.", "Combine spaghetti, pancetta, and egg mixture.", "Season with black pepper and serve."]
 *                 image: "https://example.com/spaghetti-carbonara.jpg"
 *     responses:
 *       200:
 *         description: The recipe was successfully edited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Recipe not found
 */
recipeRouter.put("/", authMiddleware, recipeController.edit.bind(recipeController));

/**
 * @swagger
 * /recipe/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Delete a recipe
 *     description: Need to provide the access token in the auth header.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe id to delete
 *     responses:
 *       200:
 *         description: The recipe was successfully deleted
 *       400:
 *         description: Invalid recipe id
 *       404:
 *         description: Recipe not found
 */
recipeRouter.delete("/:id", authMiddleware, recipeController.delete.bind(recipeController));


export default recipeRouter;
