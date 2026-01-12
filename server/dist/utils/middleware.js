"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Middleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function Middleware(req, res, next) {
    // middleware logic
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token not available" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        console.log(decoded.id);
        req.user = decoded.id;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}
