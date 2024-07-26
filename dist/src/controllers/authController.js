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
exports.authMiddleware = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.name;
    const user = yield userModel_1.default.findOne({ username: username });
    if (user) {
        return res.status(200).send(user);
    }
    return res.status(404).send("User not found");
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const imgUrl = req.body.userImg;
    if (email === undefined || password === undefined) {
        return res.status(400).send("Email and password are required");
    }
    try {
        let user = yield userModel_1.default.findOne({ email: email });
        if (user) {
            return res.status(409).send("User already exists");
        }
        user = yield userModel_1.default.findOne({ username: username });
        if (user) {
            return res.status(408).send("User already exists");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield userModel_1.default.create({
            email: email,
            username: username,
            image: imgUrl,
            password: hashedPassword,
        });
        const tokens = yield generateTokens(newUser);
        if (tokens == null) {
            return res.status(400).send("Error generating tokens");
        }
        return res.status(201).send(Object.assign({ email: newUser.email, username: newUser.username, imgUrl: newUser.image }, tokens));
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const isUsernameTaken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    if (username === undefined) {
        return res.status(400).send("Username is required");
    }
    try {
        const user = yield userModel_1.default.findOne({ username: username });
        if (user) {
            return res.status(400).send("Username already exists");
        }
        else {
            return res.status(200).send("Username is available");
        }
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const isEmailTaken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    if (email === undefined) {
        return res.status(400).send("Email is required");
    }
    try {
        const user = yield userModel_1.default.findOne({ email: email });
        if (user) {
            return res.status(400).send("Email already exists");
        }
        else {
            return res.status(200).send("Email is available");
        }
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const generateTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // generate token
    const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
    const random = Math.floor(Math.random() * 1000000).toString();
    const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id, random: random }, process.env.TOKEN_SECRET, {});
    if (user.tokens == null) {
        user.tokens = [];
    }
    user.tokens.push(refreshToken);
    try {
        yield user.save();
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }
    catch (err) {
        return null;
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (email === undefined || password === undefined) {
        return res.status(400).send("Email and password are required");
    }
    try {
        const user = yield userModel_1.default.findOne({ email: email });
        if (user == null) {
            return res.status(400).send("User doesnot exists");
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }
        const tokens = yield generateTokens(user);
        if (tokens == null) {
            return res.status(400).send("Error generating tokens");
        }
        return res.status(200).send(Object.assign({ email: user.email, username: user.username, imgUrl: user.image }, tokens));
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const client = new google_auth_library_1.OAuth2Client();
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield client.verifyIdToken({
            idToken: req.body.credentials,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        let user = yield userModel_1.default.findOne({ email: email });
        if (user == null) {
            user = yield userModel_1.default.create({
                email: email,
                username: payload.name,
                password: "google-login",
                imgUrl: payload.picture,
            });
        }
        const tokens = yield generateTokens(user);
        res.status(200).send(Object.assign({ email: user.email, username: user.username, imgUrl: user.image }, tokens));
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = extractToken(req);
    if (refreshToken == null) {
        return res.sendStatus(401);
    }
    try {
        jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.sendStatus(403);
            }
            const user = yield userModel_1.default.findOne({ _id: data._id });
            if (user == null) {
                return res.sendStatus(403);
            }
            if (!user.tokens.includes(refreshToken)) {
                user.tokens = [];
                yield user.save();
                return res.sendStatus(403);
            }
            user.tokens = user.tokens.filter((token) => token !== refreshToken);
            const tokens = yield generateTokens(user);
            if (tokens == null) {
                return res.status(400).send("Error generating tokens");
            }
            return res.status(200).send(tokens);
        }));
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const extractToken = (req) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    return token;
};
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = extractToken(req);
    if (refreshToken == null) {
        return res.sendStatus(401);
    }
    try {
        jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.sendStatus(403);
            }
            const user = yield userModel_1.default.findOne({ _id: data._id });
            if (user == null) {
                return res.sendStatus(403);
            }
            if (!user.tokens.includes(refreshToken)) {
                user.tokens = [];
                yield user.save();
                return res.sendStatus(403);
            }
            user.tokens = user.tokens.filter((token) => token !== refreshToken);
            yield user.save();
            return res.status(200).send();
        }));
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
    res.send("logout");
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const username = req.body.username;
        const user = yield userModel_1.default.findOne({ username: username });
        const isMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (user == null || !isMatch) {
            return res.status(400).send("Invalid credentials");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
        user.password = hashedPassword;
        const response = yield userModel_1.default.findOneAndUpdate({ username: username }, user, {
            new: true,
        });
        return res.status(200).send(response);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
});
const checkToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = extractToken(req);
    try {
        jsonwebtoken_1.default.verify(accessToken, process.env.TOKEN_SECRET, (err, data) => {
            if (err) {
                return res.sendStatus(403);
            }
            else {
                return res.sendStatus(200);
            }
        });
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = extractToken(req);
    if (token == null) {
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.status(401).send(err.message);
        }
        const id = data._id;
        req.user = { _id: id };
        return next();
    });
});
exports.authMiddleware = authMiddleware;
const updateUserImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imgUrl = req.body.imgUrl;
        const username = req.user._id;
        const user = yield userModel_1.default.findOne({ _id: username });
        user.image = imgUrl;
        yield user.save();
        return res.status(200).send(user);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
exports.default = {
    register,
    isEmailTaken,
    login,
    logout,
    authMiddleware: exports.authMiddleware,
    refresh,
    googleLogin,
    changePassword,
    checkToken,
    updateUserImg,
    isUsernameTaken,
    getUser
};
//# sourceMappingURL=authController.js.map