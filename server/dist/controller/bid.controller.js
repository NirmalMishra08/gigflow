"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBidsForClients = exports.getAllBidsForFreeLancer = void 0;
exports.CreateBid = CreateBid;
exports.HireFreeLancer = HireFreeLancer;
exports.getAllBids = getAllBids;
exports.GetallBidByGigId = GetallBidByGigId;
const bid_model_1 = __importDefault(require("../model/bid.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const job_model_1 = __importDefault(require("../model/job.model"));
const socket_1 = require("../utils/socket");
async function CreateBid(req, res) {
    try {
        const { gigId, message, price } = req.body;
        if (!gigId || !message) {
            return res.status(400).json({
                message: "Something is missing"
            });
        }
        const freeLancerId = req.user.id;
        if (!freeLancerId) {
            return res.status(401).json({ success: false, message: "not authorized" });
        }
        const gig = await job_model_1.default.findOne({ _id: gigId });
        if (!gig) {
            return res.status(400).json({ success: false, message: "no such gig exists" });
        }
        if (gig.ownerId == freeLancerId) {
            return res.status(400).json({ success: false, message: "You cannot perform this Action." });
        }
        const alreadyBidExist = await bid_model_1.default.findOne({
            freeLancerId: freeLancerId,
            gigId: gigId
        });
        if (alreadyBidExist != null) {
            return res.status(400).json({ success: false, message: "You have already bidded for this project" });
        }
        const bid = await bid_model_1.default.create({
            gigId: gigId,
            message: message,
            freeLancerId: freeLancerId,
            price: Number(price)
        });
        return res.status(201).json({
            success: true,
            message: "bid created successfully",
            bid: bid
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error Creating bids" });
    }
}
async function HireFreeLancer(req, res) {
    const { bidId } = req.params;
    const clientId = req.user.id;
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const bid = await bid_model_1.default.findById(bidId).session(session);
        if (!bid)
            throw new Error("Bid not found");
        if (bid.freeLancerId.toString() === clientId) {
            throw new Error("You cannot hire yourself for your own gig.");
        }
        const updatedGig = await job_model_1.default.findOneAndUpdate({
            _id: bid.gigId,
            ownerId: clientId,
            status: "open"
        }, {
            $set: {
                status: "assigned",
                freeLancerId: bid.freeLancerId
            }
        }, {
            new: true,
            session
        });
        if (!updatedGig) {
            // If the gig was already assigned by someone else, this fails
            throw new Error("Gig is no longer available or unauthorized");
        }
        // update that bid 
        bid.status = "hired";
        await bid.save({ session });
        // update all the others bid as rejected
        await bid_model_1.default.updateMany({
            gigId: bid.gigId, _id: { $ne: bidId }
        }, {
            $set: {
                status: "rejected"
            }
        }, { session });
        // commit the transaction
        await session.commitTransaction();
        (0, socket_1.sendNotification)(bid.freeLancerId.toString(), `You have been hired for ${updatedGig.title}!`);
        res.status(200).json({
            message: "Success! Freelancer hired and other bids closed.",
            gig: updatedGig
        });
    }
    catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    }
    finally {
        // close the session
        session.endSession();
    }
}
async function getAllBids(req, res) {
    try {
        const { gigId } = req.params;
        const clientId = req.user.id;
        if (!clientId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!gigId) {
            return res.status(422).json({
                message: "gig ID is missing"
            });
        }
        const gig = await job_model_1.default.findOne({
            _id: gigId
        });
        if (!gig) {
            return res.status(400).json({ message: "no such gigs" });
        }
        if (gig.ownerId != clientId) {
            return res.status(400).json("not same owner id");
        }
        const bids = await bid_model_1.default.find({
            gigId: gigId,
        });
        return res.status(200).json({
            bids: bids
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
const getAllBidsForFreeLancer = async (req, res) => {
    try {
        const clientId = req.user.id;
        if (!clientId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const allBids = await bid_model_1.default.find({
            freeLancerId: clientId
        })
            .populate('gigId')
            .sort({ createdAt: -1 });
        const stats = allBids.reduce((acc, bid) => {
            if (bid.status === "hired")
                acc.accepted++;
            if (bid.status === "pending")
                acc.pending++;
            return acc;
        }, { accepted: 0, pending: 0 });
        return res.status(200).json({
            success: true,
            data: {
                Bids: allBids,
                totalBids: allBids.length,
                acceptedBids: stats.accepted,
                pendingBids: stats.pending,
            }
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getAllBidsForFreeLancer = getAllBidsForFreeLancer;
const getAllBidsForClients = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const allGigs = await job_model_1.default.find({
            ownerId: userId
        });
        const openGigs = allGigs.reduce((acc, gig) => {
            if (gig.status === "open")
                acc.active++;
            if (gig.status === 'assigned')
                acc.assigned++;
            return acc;
        }, {
            active: 0,
            assigned: 0
        });
        const gigIds = allGigs.map(gig => gig._id);
        const totalBidsReceived = await bid_model_1.default.countDocuments({
            gigId: { $in: gigIds }
        });
        return res.status(200).json({
            success: true,
            data: {
                AllGigs: allGigs,
                totalGigs: allGigs.length,
                activeGigs: openGigs.active,
                assignedGigs: openGigs.assigned,
                totalBidsReceived: totalBidsReceived
            }
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getAllBidsForClients = getAllBidsForClients;
async function GetallBidByGigId(req, res) {
    try {
        const userId = req.user.id;
        const { gigId } = req.params;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // check if that gig belong to that client
        const findGig = await job_model_1.default.findOne({
            _id: gigId
        });
        if (findGig?.ownerId != userId) {
            return res.status(400).json({ success: false, message: "you are not authorized to do this" });
        }
        const allBid = await bid_model_1.default.find({
            gigId: gigId
        }).populate('freeLancerId', 'name')
            .sort({ createdAt: -1 });
        return res.status(200).json({ sucess: true, data: allBid });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
