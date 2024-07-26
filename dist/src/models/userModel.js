"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true,
    },
    favorites: {
        type: [String],
    },
    tokens: {
        type: [String],
    },
});
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=userModel.js.map