import { Request, Response } from "express";
import Gig from "../model/job.model";
import User from "../model/auth.model";

export async function getAllGigs(req: Request, res: Response) {
    try {
        const { search } = req.query;
        console.log(search)

        let query: any = { status: "open" };

        if (search) {
            query.title = { $regex: search, $options: 'i' }
        }

        const gigs = await Gig.find(query).sort({ createdAt: -1 })

        const ownerIds = gigs.map((gig) => gig.ownerId);
        const users = await User.find({
            _id: { $in: ownerIds }
        });
        console.log(users)

        const combinedData = gigs.map((gig) => {
            const owner = gig.ownerId ? users.find(user => user._id.toString() === (gig.ownerId as any).toString()) : undefined;
            return {
                ...gig.toObject(),
                ownerName: owner ? owner.name : "Unknown User"
            };
        })
        console.log(combinedData)


        return res.status(200).json({
            status: 'success',
            results: gigs.length,
            data: combinedData
        })
    } catch (error) {
        return res.status(500).json({ message: "Error fetching gigs" });
    }
}

export async function CreateGig(req: Request, res: Response) {
    try {
        const { title, description, budget } = req.body;
        console.log(title, description, budget)
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        console.log(req.user)

        if (!title || !description || !budget) {
            return res.status(400).json({ message: "body is missing" })
        }

        const ownerId = (req.user as any).id;

        const newGig = await Gig.create({
            title: title,
            description: description,
            budget: budget,
            ownerId: ownerId
        })

        return res.status(200).json({
            success: "true",
            message: "created the gig successfully",
            gig: newGig
        })

    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

