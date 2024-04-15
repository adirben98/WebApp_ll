import  express  from "express"
import BookController from "../controllers/bookController"
import e from "express";
export const router = express.Router();
//implement bookRouter
router.get("/", BookController.getAllBooks)
router.get("/:id", BookController.getBook)
router.post("/", BookController.addBook)
router.delete("/:id", BookController.deleteBook)

export default router
