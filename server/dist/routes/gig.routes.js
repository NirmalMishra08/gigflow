"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gig_controller_1 = require("../controller/gig.controller");
const middleware_1 = __importDefault(require("../utils/middleware"));
const router = express_1.default.Router();
router.post("/", middleware_1.default, gig_controller_1.CreateGig);
router.get("/", middleware_1.default, gig_controller_1.getAllGigs);
exports.default = router;
