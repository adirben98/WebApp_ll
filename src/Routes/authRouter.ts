import express from "express";
const authRouter = express.Router();
import authController from "../controllers/authController";

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
 *         - full_name
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         full_name:
 *           type: string
 *           description: The user full name
 *         password:
 *           type: string
 *           description: The user password
 *       example:
 *         email: 'bob@gmail.com'
 *         full_name: 'Bob the builder'
 *         password: '123456'
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
 *     summary: registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */


authRouter.post("/register", authController.register);

/**
* @swagger
* /auth/login:
*   post:
*     summary: logs in a user
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The access & refresh tokens
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tokens'
*/

authRouter.post("/login", authController.login);

/**
* @swagger
* /auth/refresh:
*   get:
*     summary: get a new access token using the refresh token
*     tags: [Auth]
*     description: need to provide the refresh token in the auth header
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The access & refresh tokens
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tokens'
*/


authRouter.get("/refresh", authController.refresh);

/**
* @swagger
* /auth/logout:
*   get:
*     summary: logout a user
*     tags: [Auth]
*     description: need to provide the refresh token in the auth header
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: logout completed successfully
*/


authRouter.get("/logout", authController.logout);

export default authRouter;