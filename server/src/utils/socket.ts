import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server | null = null
const userSockets = new Map();

export const initSocket = (server: HttpServer, clientPort: string) => {
    io = new Server(server, {
        cors: { origin: clientPort }
    })

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId
        if (userId) userSockets.set(userId, socket.id);

        socket.on("disconnect", () => {
            userSockets.delete(userId);
        });
    })

    return io;
}

export const sendNotification = (userId: string, message: string) => {
    const socketId = userSockets.get(userId);
    if (socketId && io) {
        io.to(socketId).emit("notification", { message });
    }
}