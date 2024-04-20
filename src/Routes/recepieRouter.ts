import express from "express"
const recepieRouter = express.Router();
import recepieController from "../controllers/recepieController"
import {authMiddleware} from "../controllers/authController"

recepieRouter.get("/:id",authMiddleware,recepieController.get.bind(recepieController))

recepieRouter.post("/",authMiddleware,recepieController.post.bind(recepieController))

recepieRouter.put("/",authMiddleware,recepieController.edit.bind(recepieController))

recepieRouter.delete("/",authMiddleware,recepieController.delete.bind(recepieController))










export default recepieRouter;