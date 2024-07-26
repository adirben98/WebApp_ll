"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipeRouter = express_1.default.Router();
const recipeController_1 = __importDefault(require("../controllers/recipeController"));
const authController_1 = require("../controllers/authController");
const restApi_1 = __importDefault(require("../controllers/restApi"));
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
recipeRouter.post("/", authController_1.authMiddleware, recipeController_1.default.post.bind(recipeController_1.default));
/**
 * @swagger
 * /recipe/randomRESTApi:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Get five random recipes
 *     description: Retrieve five random recipes from the REST API.
 *     responses:
 *       200:
 *         description: An array of five random recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Failed to fetch random recipes
 */
recipeRouter.get("/randomRESTApi", authController_1.authMiddleware, restApi_1.default.getFiveRandomRecipe);
/**
 * @swagger
 * /recipe:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Get all recipes
 *     description: Retrieve a list of all recipes.
 *     responses:
 *       200:
 *         description: A list of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Failed to fetch recipes
 */
recipeRouter.get("/", authController_1.authMiddleware, recipeController_1.default.getAll.bind(recipeController_1.default));
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
recipeRouter.get("/getCategories", authController_1.authMiddleware, restApi_1.default.getCategories);
/**
 * @swagger
 * /recipe/getUserRecipesAndFavorites/{name}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Get user's recipes and favorites
 *     description: Retrieve a list of recipes created by the user and their favorite recipes.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The username
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
recipeRouter.get("/getUserRecipesAndFavorites/:name", authController_1.authMiddleware, recipeController_1.default.getUserRecipesAndFavorites.bind(recipeController_1.default));
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
recipeRouter.get("/search", authController_1.authMiddleware, recipeController_1.default.search.bind(recipeController_1.default));
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
recipeRouter.get("/categorySearch/:name", authController_1.authMiddleware, restApi_1.default.categorySearch.bind(recipeController_1.default));
/**
 * @swagger
 * /recipe/recipeFromApi/{name}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Recipe
 *     summary: Get a recipe by name from API
 *     description: Retrieve a recipe by name from the external API.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The recipe name
 *     responses:
 *       200:
 *         description: The recipe was found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Error performing search
 */
recipeRouter.get("/recipeFromApi/:name", authController_1.authMiddleware, restApi_1.default.getRecipeByName.bind(recipeController_1.default));
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
recipeRouter.get("/topFive", recipeController_1.default.getTopFive);
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
recipeRouter.get("/:id", authController_1.authMiddleware, recipeController_1.default.get.bind(recipeController_1.default));
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
recipeRouter.get("/isLiked/:id", authController_1.authMiddleware, recipeController_1.default.isLiked.bind(recipeController_1.default));
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
recipeRouter.post("/like/:id", authController_1.authMiddleware, recipeController_1.default.likeIncrement.bind(recipeController_1.default));
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
recipeRouter.post("/unlike/:id", authController_1.authMiddleware, recipeController_1.default.likeDecrement.bind(recipeController_1.default));
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
recipeRouter.put("/", authController_1.authMiddleware, recipeController_1.default.edit.bind(recipeController_1.default));
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
recipeRouter.delete("/:id", authController_1.authMiddleware, recipeController_1.default.delete.bind(recipeController_1.default));
exports.default = recipeRouter;
//# sourceMappingURL=recipeRouter.js.map