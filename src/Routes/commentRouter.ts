import express from "express"
const commentRouter = express.Router();
import commentController from "../controllers/commentController"
import {authMiddleware} from "../controllers/authController"

commentRouter.get("/:recepieId",authMiddleware,commentController.get.bind(commentController))     

commentRouter.post("/",authMiddleware,commentController.post.bind(commentController))

commentRouter.put("/",authMiddleware,commentController.edit.bind(commentController))

commentRouter.delete("/",authMiddleware,commentController.delete.bind(commentController))












export default commentRouter;