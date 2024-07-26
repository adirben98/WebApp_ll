"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const commentSchema = new mongoose_1.default.Schema({
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    recipeId: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: (0, moment_1.default)().format('MMMM Do YYYY, h:mm:ss a')
    },
    edited: {
        type: Boolean,
        default: false
    }
});
exports.default = mongoose_1.default.model("Comment", commentSchema);
//# sourceMappingURL=commentModel.js.map