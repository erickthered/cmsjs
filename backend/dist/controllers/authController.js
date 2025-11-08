"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const config_1 = __importDefault(require("../config"));
// Register a new user
const register = async (req, res, next) => {
    const { email, fullName, nickName, profile, password } = req.body;
    try {
        let user = await User_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const isFirstUser = (await User_1.default.countDocuments({})) === 0;
        const group = isFirstUser ? 'admin' : 'editor';
        user = new User_1.default({
            email,
            fullName,
            nickName,
            profile,
            password,
            group,
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id, group: user.group }, config_1.default.jwtSecret, { expiresIn: '1h' });
        res.status(201).json({ token });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// Login user
const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, group: user.group }, config_1.default.jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
