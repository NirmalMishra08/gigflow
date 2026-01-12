"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String },
    email: { type: String, unique: true, require: true },
    password: { type: String }
});
const user = (0, mongoose_1.model)("User", userSchema);
exports.default = user;
