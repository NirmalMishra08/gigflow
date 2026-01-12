"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectDB = ConnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function ConnectDB(URI) {
    try {
        await mongoose_1.default.connect(URI);
        console.log("MongoDB connected successfully");
    }
    catch (err) {
        console.log("Error occurred while connecting to MongoDB:", err.message);
        process.exit(1);
    }
}
