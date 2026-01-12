import { Request, Response } from "express";
import Bid from "../model/bid.model";
import mongoose from "mongoose";
import Gig from "../model/job.model";

export async function CreateBid(req: Request, res: Response) {
    try {
        const { gigId, message } = req.body

        if (!gigId || !message) {
            return res.status(400).json({
                message: "Something is missing"
            })
        }

        const freeLancerId = (req.user as any).id;
        if (!freeLancerId) {
            return res.status(401).json({ message: "not authorized" })
        }

        const bid = await Bid.create({
            gigId: gigId,
            message: message,
            freeLancerId: freeLancerId
        })

        return res.status(201).json({
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

        const updatedGig = await Gig.findOneAndUpdate({
            _id: bid.gigId,
            ownerId: clientId,
            status: "open"
        },
            {
                $set: {
                    status: "assigned"
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
            gigId: bid.gigId, _id: bidId
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

        if(gig.ownerId != clientId){
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