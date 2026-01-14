import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import { ConnectDB } from "./utils/connectDB";
import authRoutes from "./routes/auth.routes";
import gigRoutes from "./routes/gig.routes"
import cookieParser from "cookie-parser";
import bidRoutes from "./routes/bid.routes"

import dotenv from "dotenv"
import { initSocket } from "./utils/socket";

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());


app.get("/", (req: Request, res: Response) => {
    return res.send("hello from hello world")
});


app.use("/api/auth", authRoutes);

app.use("/api/gigs", gigRoutes)

app.use("/api/bids", bidRoutes)

const server = http.createServer(app);

// Socket.io setup
const io = initSocket(server, process.env.CLIENT_URL as string);

app.set("io", io);

ConnectDB(process.env.MONGO_URI as string)
    .then(() => server.listen(process.env.PORT, () => {
        console.log(" Server running on http://localhost:PORT");
    }))
    .catch((err) => {
        console.log("Error connecting mongodb", err)
    })



