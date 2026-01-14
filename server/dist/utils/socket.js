"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io = null;
const userSockets = new Map();
const initSocket = (server, clientPort) => {
    io = new socket_io_1.Server(server, {
        cors: { origin: clientPort }
    });
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId)
            userSockets.set(userId, socket.id);
        socket.on("disconnect", () => {
            userSockets.delete(userId);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const sendNotification = (userId, message) => {
    const socketId = userSockets.get(userId);
    if (socketId && io) {
        io.to(socketId).emit("notification", message);
    }
};
exports.sendNotification = sendNotification;
