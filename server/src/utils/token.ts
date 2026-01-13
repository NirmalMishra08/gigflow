import jwt from "jsonwebtoken"
import { Response } from "express"

const sendToken = (user: any, statusCode: number, res: Response) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const
    };

    console.log(token)

    return res.status(statusCode).cookie('token', token, cookieOptions).json({
        status: 'success',
        user: { id: user._id, name: user.name }
    });
};

export default sendToken;