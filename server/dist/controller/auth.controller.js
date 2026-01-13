"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_model_1 = __importDefault(require("../model/auth.model"));
const token_1 = __importDefault(require("../utils/token"));
const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "something is missing" });
        }
        const alreadyExist = await auth_model_1.default.findOne({ email: email });
        if (alreadyExist) {
            return res.status(409).json({ message: "already exist" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await auth_model_1.default.create({
            name,
            email,
            password: hashedPassword
        });
        const userResponse = user.toObject();
        delete userResponse.password;
        const response = (0, token_1.default)(userResponse, 201, res);
        return response;
    }
    catch (error) {
        return res.status(400).json({ message: "error occurred: ", error: error });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "something is missing" });
        }
        const user = await auth_model_1.default.findOne({
            email: email
        });
        if (!user || !user.password) {
            return res.status(401).json({ message: "invalid credentials" });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: true,
                message: "Not valid password"
            });
        }
        const userResponse = user.toObject();
        delete userResponse.password;
        return (0, token_1.default)(userResponse, 200, res);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
exports.loginUser = loginUser;
