import BaseController from "./baseController";
import Comment,{IComment} from "../models/commentModel"

class commentController extends BaseController<IComment>{
    constructor(){
        super(Comment)
    }
}







export default new commentController()