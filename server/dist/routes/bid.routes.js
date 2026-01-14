"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const bid_controller_1 = require("../controller/bid.controller");
const router = express_1.default.Router();
router.post("/", middleware_1.default, bid_controller_1.CreateBid);
router.patch("/:bidId/hire", middleware_1.default, bid_controller_1.HireFreeLancer);
router.get("/free", middleware_1.default, bid_controller_1.getAllBidsForFreeLancer);
router.get("/client", middleware_1.default, bid_controller_1.getAllBidsForClients);
router.get("/:gigId", middleware_1.default, bid_controller_1.GetallBidByGigId);
exports.default = router;
