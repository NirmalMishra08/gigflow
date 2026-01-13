"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGigs = getAllGigs;
exports.CreateGig = CreateGig;
const job_model_1 = __importDefault(require("../model/job.model"));
const auth_model_1 = __importDefault(require("../model/auth.model"));
async function getAllGigs(req, res) {
    try {
        const { search } = req.query;
        console.log(search);
        let query = { status: "open" };
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        const gigs = await job_model_1.default.find(query).sort({ createdAt: -1 });
        const ownerIds = gigs.map((gig) => gig.ownerId);
        const users = await auth_model_1.default.find({
            _id: { $in: ownerIds }
        });
        console.log(users);
        const combinedData = gigs.map((gig) => {
            const owner = gig.ownerId ? users.find(user => user._id.toString() === gig.ownerId.toString()) : undefined;
            return {
                ...gig.toObject(),
                ownerName: owner ? owner.name : "Unknown User"
            };
        });
        console.log(combinedData);
        return res.status(200).json({
            status: 'success',
            results: gigs.length,
            data: combinedData
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching gigs" });
    }
}
async function CreateGig(req, res) {
    try {
        const { title, description, budget } = req.body;
        console.log(title, description, budget);
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        console.log(req.user);
        if (!title || !description || !budget) {
            return res.status(400).json({ message: "body is missing" });
        }
        const ownerId = req.user.id;
        const newGig = await job_model_1.default.create({
            title: title,
            description: description,
            budget: budget,
            ownerId: ownerId
        });
        return res.status(200).json({
            success: "true",
            message: "created the gig successfully",
            gig: newGig
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
