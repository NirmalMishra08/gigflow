

import { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import User from '../model/auth.model';
import sendToken from '../utils/token';
import { send } from 'node:process';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "something is missing" });
        }

        const alreadyExist = await User.findOne({ email: email.toLowerCase() });

        if (alreadyExist) {
            return res.status(409).json({ message: "already exist" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const userResponse = user.toObject();
        delete userResponse.password;

        const response = sendToken(user, 201, res)

        return response
    } catch (error) {
        return res.status(400).json({ message: "error occurred: ", error: error as Error })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "something is missing" });
        }

        const user = await User.findOne({
            email: email
        })

        if (!user || !user.password) {
            return res.status(401).json({ message: "invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({
                success: true,
                message: "Not valid password"
            })
        }


        const userResponse = user.toObject();
        delete userResponse.password;
        return sendToken(userResponse,200,res);

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error", 
            error: (error as Error).message
        })
    }
}