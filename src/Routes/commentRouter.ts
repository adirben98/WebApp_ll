import express from "express"
const commentRouter = express.Router();
import commentController from "../controllers/commentController"

commentRouter.get("/:id",commentController.get.bind(commentController))     

commentRouter.post("/",commentController.post.bind(commentController))

commentRouter.put("/",commentController.edit.bind(commentController))

commentRouter.delete("/",commentController.delete.bind(commentController))












export default commentRouter;