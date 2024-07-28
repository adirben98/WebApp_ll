"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const RecipeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    authorImg: {
        type: String,
        required: false
    },
    ingredients: {
        type: [String],
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        default: (0, moment_1.default)().format("MMMM Do YYYY, h:mm:ss a"),
    },
    image: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: [String],
        default: []
    }
});
exports.default = mongoose_1.default.model("Recipe", RecipeSchema);
//# sourceMappingURL=recipeModel.js.map