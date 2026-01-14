import express from "express";
import http from "http";
import cors from "cors";
import { ConnectDB } from "./utils/connectDB";
import authRoutes from "./routes/auth.routes";
import gigRoutes from "./routes/gig.routes"
import cookieParser from "cookie-parser";
import bidRoutes from "./routes/bid.routes"
// import { Server } from "socket.io";

import dotenv from "dotenv"
import { initSocket } from "./utils/socket";

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());


app.get("/", (req, res) => {
    return res.send("hello from hello world")
});


app.use("/api/auth", authRoutes);

app.use("/api/gigs", gigRoutes)

app.use("/api/bids", bidRoutes)

const server = http.createServer(app);

// // Socket.io setup
const io = initSocket(server, "http://localhost:5173");

app.set("io", io);

ConnectDB(process.env.MONGO_URI as string)
    .then(() => server.listen(4000, () => {
        console.log(" Server running on http://localhost:4000");
    }))
    .catch((err) => {
        console.log("Error connecting mongodb", err)
    })



