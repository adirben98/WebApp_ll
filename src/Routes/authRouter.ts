import express from "express";
const authRouter = express.Router();
import authController, { authMiddleware } from "../controllers/authController";
import { auth } from "google-auth-library";

/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/
/**
* @swagger
* components:
*   securitySchemes:
*       bearerAuth:
*           type: http
*           scheme: bearer
*           bearerFormat: JWT
*/
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         username:
 *           type: string
 *           description: The user full name
 *         password:
 *           type: string
 *           description: The user password
 *       example:
 *         email: 'Tal@gmail.com'
 *         username: 'Talker the chef'
 *         password: '1234'
 */
/**
* @swagger
* components:
*   schemas:
*     Tokens:
*       type: object
*       required:
*         - accessToken
*         - refreshToken
*       properties:
*         accessToken:
*           type: string
*           description: The JWT access token
*         refreshToken:
*           type: string
*           description: The JWT refresh token
*       example:
*         accessToken: '123cd123x1xx1'
*         refreshToken: '134r2134cr1x3c'
*/

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Email and password are required
 *       409:
 *         description: User already exists
 */
authRouter.post("/register", authController.register);

/**
 * @swagger
 * /auth/isEmailTaken:
 *   post:
 *     summary: Checks if an email is already taken
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: 'Tal@gmail.com'
 *     responses:
 *       200:
 *         description: The email is available
 *       400:
 *         description: The email is already taken
 */
authRouter.post("/isEmailTaken", authController.isEmailTaken);

/**
 * @swagger
 * /auth/isUsernameTaken:
 *   post:
 *     summary: Checks if a username is already taken
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *             example:
 *               username: 'Talker the chef'
 *     responses:
 *       200:
 *         description: The username is available
 *       400:
 *         description: The username is already taken
 */
authRouter.post("/isUsernameTaken", authController.isUsernameTaken);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: 'Tal@gmail.com'
 *               password: '1234'
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       400:
 *         description: User does not exist or invalid credentials
 */
authRouter.post("/login", authController.login);

/**
 * @swagger
 * /auth/googleLogin:
 *   post:
 *     summary: Logs in a user using Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credentials:
 *                 type: string
 *                 description: The Google OAuth credentials
 *             example:
 *               credentials: 'GOOGLE_OAUTH_TOKEN'
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       400:
 *         description: Error during Google login
 */
authRouter.post("/googleLogin", authController.googleLogin);

/**
 * @swagger
 * /auth/checkToken:
 *   post:
 *     summary: Checks if a token is valid
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The token is valid
 *       403:
 *         description: The token is invalid or expired
 *       400:
 *         description: Error during token check
 */
authRouter.post("/checkToken", authController.checkToken);

/**
 * @swagger
 * /auth/updateUserImg:
 *   put:
 *     summary: Updates a user's image
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *               imgUrl:
 *                 type: string
 *                 description: The new image URL
 *             example:
 *               username: 'Talker the chef'
 *               imgUrl: 'https://example.com/new-image.jpg'
 *     responses:
 *       200:
 *         description: The user's image was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error updating user image
 */
authRouter.put("/updateUserImg", authController.updateUserImg);

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Gets a new access token using the refresh token
 *     tags: [Auth]
 *     description: Need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       401:
 *         description: Refresh token is required
 *       403:
 *         description: Invalid or expired refresh token
 *       400:
 *         description: Error generating new tokens
 */
authRouter.get("/refresh", authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logs out a user
 *     tags: [Auth]
 *     description: Need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout completed successfully
 *       401:
 *         description: Refresh token is required
 *       403:
 *         description: Invalid or expired refresh token
 *       400:
 *         description: Error during logout
 */
authRouter.get("/logout", authController.logout);

/**
 * @swagger
 * /auth/changePassword:
 *   put:
 *     summary: Changes a user's password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *               oldPassword:
 *                 type: string
 *                 description: The user's current password
 *               newPassword:
 *                 type: string
 *                 description: The user's new password
 *             example:
 *               username: 'Talker the chef'
 *               oldPassword: '1234'
 *               newPassword: '5678'
 *     responses:
 *       200:
 *         description: The user's password was successfully changed
 *       400:
 *         description: Invalid credentials or error changing password
 */
authRouter.put("/changePassword", authMiddleware, authController.changePassword);
authRouter.get("/getUser/:name",authMiddleware,authController.getUser);

export default authRouter;
