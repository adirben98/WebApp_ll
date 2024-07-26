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
const userModel_1 = __importDefault(require("../models/userModel"));
class BaseController {
    constructor(model) {
        this.model = model;
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                if (req.user) {
                    user = yield userModel_1.default.findById({ _id: req.user._id });
                }
                if (req.params.id != null ||
                    req.params.recipeId != null ||
                    user != null) {
                    if (req.params.id) {
                        const modelObject = yield this.model.findById(req.params.id);
                        if (modelObject !== null) {
                            return res.status(200).send(modelObject);
                        }
                    }
                    else if (req.params.recipeId) {
                        const modelObject = yield this.model.find({
                            recipeId: req.params.recipeId,
                        });
                        if (modelObject !== null) {
                            return res.status(200).send(modelObject.reverse());
                        }
                    }
                    else {
                        const modelObject = yield this.model.find({ author: user.username });
                        return res.status(200).send(modelObject.reverse());
                    }
                }
                return res.status(404).send();
            }
            catch (err) {
                res.status(500).send(err.message);
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.user._id;
                const user = yield userModel_1.default.findById({ _id: _id });
                const modelObject = req.body;
                modelObject.author = user.username;
                const newModelObject = yield this.model.create(modelObject);
                res.status(201).json(newModelObject);
            }
            catch (err) {
                res.status(500).send(err.message);
            }
        });
    }
    edit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body) {
                    const modelObject = req.body;
                    const updatedModel = yield this.model.findByIdAndUpdate(modelObject._id, modelObject, { new: true });
                    res.status(200).send(updatedModel);
                }
                res.status(400).send();
            }
            catch (err) {
                res.status(500).send(err.message);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.params.id != null) {
                    yield this.model.findByIdAndDelete({ _id: req.params.id });
                    return res.status(200).send();
                }
                return res.status(400).send();
            }
            catch (err) {
                res.status(500).send(err.message);
            }
        });
    }
}
exports.default = BaseController;
//# sourceMappingURL=baseController.js.map