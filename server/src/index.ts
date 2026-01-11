import express from "express";
import http from "http";
import cors from "cors";
import { ConnectDB } from "./utils/connectDB";
// import { Server } from "socket.io";

import dotenv from "dotenv"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// REST endpoint example
app.get("/", (req, res) => {
    return res.send("hello from hello world")
});

const server = http.createServer(app);

// // Socket.io setup
// const io = new Server(server, {
//   cors: {
//     origin: "*"
//   }
// });

// // Make io accessible in routes
// app.set("io", io);

// initSocket(io);

ConnectDB(process.env.MONGO_URI as string)
    .then(() => server.listen(4000, () => {
        console.log(" Server running on http://localhost:4000");
    }))
    .catch((err) => {
        console.log("Error connecting mongodb", err)
    })



