"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const connectDB_1 = require("./utils/connectDB");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const gig_routes_1 = __importDefault(require("./routes/gig.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import { Server } from "socket.io";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
// REST endpoint example
app.get("/", (req, res) => {
    return res.send("hello from hello world");
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/gigs", gig_routes_1.default);
const server = http_1.default.createServer(app);
// // Socket.io setup
// const io = new Server(server, {
//   cors: {
//     origin: "*"
//   }
// });
// // Make io accessible in routes
// app.set("io", io);
// initSocket(io);
(0, connectDB_1.ConnectDB)(process.env.MONGO_URI)
    .then(() => server.listen(4000, () => {
    console.log(" Server running on http://localhost:4000");
}))
    .catch((err) => {
    console.log("Error connecting mongodb", err);
});
