import { Request, Response } from "express";
import Bid from "../model/bid.model";
import mongoose from "mongoose";
import Gig from "../model/job.model";
import { sendNotification } from "../utils/socket";

interface GigStats {
    active: number;
    assigned: number;
}

export async function CreateBid(req: Request, res: Response) {
    try {
        const { gigId, message, price } = req.body

        if (!gigId || !message) {
            return res.status(400).json({
                message: "Something is missing"
            })
        }

        const freeLancerId = (req.user as any).id;
        if (!freeLancerId) {
            return res.status(401).json({ success: false, message: "not authorized" })
        }

        const gig = await Gig.findOne({ _id: gigId });
        if (!gig) {
            return res.status(400).json({ success: false, message: "no such gig exists" });
        }

        if (gig.ownerId == freeLancerId) {
            return res.status(400).json({ success: false, message: "You cannot perform this Action." })
        }

        const alreadyBidExist = await Bid.findOne({
            freeLancerId: freeLancerId,
            gigId: gigId
        })
        if (alreadyBidExist != null) {
            return res.status(400).json({ success: false, message: "You have already bidded for this project" })
        }

        const bid = await Bid.create({
            gigId: gigId,
            message: message,
            freeLancerId: freeLancerId,
            price: Number(price)

        })

        return res.status(201).json({
            success: true,
            message: "bid created successfully",
            bid: bid
        })

    } catch (error) {
        return res.status(500).json({ message: "Error Creating bids" });
    }
}


export async function HireFreeLancer(req: Request, res: Response) {
    const { bidId } = req.params;
    const clientId = (req.user as any).id;

    const session = await mongoose.startSession();

    try {

        session.startTransaction();
        const bid = await Bid.findById(bidId).session(session);

        if (!bid) throw new Error("Bid not found");

        if (bid.freeLancerId.toString() === clientId) {
            throw new Error("You cannot hire yourself for your own gig.");
        }

        const updatedGig = await Gig.findOneAndUpdate({
            _id: bid.gigId,
            ownerId: clientId,
            status: "open"
        },
            {
                $set: {
                    status: "assigned",
                    freeLancerId: bid.freeLancerId
                }
            },
            {
                new: true,
                session
            }

        )

        if (!updatedGig) {
            // If the gig was already assigned by someone else, this fails
            throw new Error("Gig is no longer available or unauthorized");
        }

        // update that bid 
        bid.status = "hired";
        await bid.save({ session });

        // update all the others bid as rejected

        await Bid.updateMany({
            gigId: bid.gigId, _id: { $ne: bidId }
        },
            {
                $set: {
                    status: "rejected"
                }
            },
            { session }
        )
        // commit the transaction
        await session.commitTransaction();

        sendNotification(bid.freeLancerId.toString(), `You have been hired for ${updatedGig.title}!`,)

        res.status(200).json({
            message: "Success! Freelancer hired and other bids closed.",
            gig: updatedGig
        });


    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: (error as Error).message });
    } finally {
        // close the session
        session.endSession();
    }
}

export async function getAllBids(req: Request, res: Response) {
    try {

        const { gigId } = req.params;

        const clientId = (req.user as any).id

        if (!clientId) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        if (!gigId) {
            return res.status(422).json({
                message: "gig ID is missing"
            })
        }

        const gig = await Gig.findOne({
            _id: gigId
        })

        if (!gig) {
            return res.status(400).json({ message: "no such gigs" })
        }

        if (gig.ownerId != clientId) {
            return res.status(400).json("not same owner id")
        }

        const bids = await Bid.find({
            gigId: gigId,

        })

        return res.status(200).json({
            bids: bids
        })



    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
}


export const getAllBidsForFreeLancer = async (req: Request, res: Response) => {
    try {
        const clientId = (req.user as any).id

        if (!clientId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const allBids = await Bid.find({
            freeLancerId: clientId
        })
            .populate('gigId')
            .sort({ createdAt: -1 })


        const stats = allBids.reduce((acc, bid) => {
            if (bid.status === "hired") acc.accepted++;
            if (bid.status === "pending") acc.pending++;
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
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }

}

export const getAllBidsForClients = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const allGigs = await Gig.find({
            ownerId: userId
        })

        const openGigs = allGigs.reduce((acc: GigStats, gig: any) => {
            if (gig.status === "open") acc.active++;
            if (gig.status === 'assigned') acc.assigned++;
            return acc;
        }, {
            active: 0,
            assigned: 0
        })

        const gigIds = allGigs.map(gig => gig._id);

        const totalBidsReceived = await Bid.countDocuments({
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
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
}

export async function GetallBidByGigId(req: Request, res: Response) {
    try {
        const userId = (req.user as any).id
        const { gigId } = req.params

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }


        // check if that gig belong to that client
        const findGig = await Gig.findOne({
            _id: gigId
        })

        if (findGig?.ownerId != userId) {
            return res.status(400).json({ success: false, message: "you are not authorized to do this" })
        }


        const allBid = await Bid.find({
            gigId: gigId
        }).populate('freeLancerId', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({ sucess: true, data: allBid })
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
}



