"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseController_1 = __importDefault(require("./baseController"));
const recipeModel_1 = __importDefault(require("../models/recipeModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class recipeController extends baseController_1.default {
    constructor() {
        super(recipeModel_1.default);
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipes = yield recipeModel_1.default.find();
                res.status(200).send(recipes);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    getTopFive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipes = yield recipeModel_1.default.find().sort({ likes: -1 }).limit(5);
                res.status(200).send(recipes);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    isLiked(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipe = yield recipeModel_1.default.findById(req.params.id);
                if (recipe.likedBy.includes(req.user._id)) {
                    return res.status(200).send(true);
                }
                return res.status(200).send(false);
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error.message);
            }
        });
    }
    likeIncrement(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipeId = req.params.id;
                const userId = req.user._id;
                const user = yield userModel_1.default.findById(userId);
                const recipe = yield recipeModel_1.default.findById(recipeId);
                if (recipe.likedBy.includes(userId)) {
                    res.status(400).send("You have already liked this recipe");
                }
                else {
                    user.favorites.push(recipeId);
                    yield user.save();
                    recipe.likes += 1;
                    recipe.likedBy.push(userId);
                    yield recipe.save();
                    res.status(200).send(recipe);
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    likeDecrement(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipeId = req.params.id;
                const userId = req.user._id;
                const user = yield userModel_1.default.findById(userId);
                const recipe = yield recipeModel_1.default.findById(recipeId);
                if (recipe.likedBy.includes(userId)) {
                    user.favorites = user.favorites.filter((id) => id !== recipeId);
                    yield user.save();
                    recipe.likes -= 1;
                    recipe.likedBy = recipe.likedBy.filter((id) => id !== userId);
                    yield recipe.save();
                    res.status(200).send(recipe);
                }
                else {
                    res.status(400).send("You haven't like this recipe yet");
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    getUserRecipesAndFavorites(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({ username: req.params.name });
                const userFavorites = user.favorites;
                let favorites = [];
                for (let i = 0; i < userFavorites.length; i++) {
                    const recipe = yield recipeModel_1.default.findById(userFavorites[i]);
                    favorites.push(recipe);
                }
                const userRecipes = yield recipeModel_1.default.find({ author: user.username });
                return res.status(200).send({
                    recipes: userRecipes,
                    favorites: favorites,
                });
            }
            catch (err) {
                res.status(400).send(err.message);
            }
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query.q;
            try {
                const results = yield recipeModel_1.default.find({ name: { $regex: query, $options: 'i' } });
                res.status(200).send(results);
            }
            catch (err) {
                res.status(500).json({ message: 'Error performing search', error: err });
            }
        });
    }
}
exports.default = new recipeController();
//# sourceMappingURL=recipeController.js.map