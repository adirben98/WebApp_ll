"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    ingredients: {
        type: [String],
        required: true,
    },
    instructions: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
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
//# sourceMappingURL=recipeModel-DESKTOP-5SQR8PG.js.map