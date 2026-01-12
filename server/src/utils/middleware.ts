
import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload
        }
    }
}

export default function Middleware(req: Request, res: Response, next: NextFunction) {
    // middleware logic
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token not available" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload

        console.log(decoded)
        req.user = decoded

        next();
    } catch (error) {
        res.clearCookie("token")
        return res.status(401).json({ message: "Unauthorized" });
    }

}

