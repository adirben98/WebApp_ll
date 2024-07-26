"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// socket_server.ts
const socket_io_1 = require("socket.io");
const messageModel_1 = __importDefault(require("./models/messageModel")); // Assume Message is a Mongoose model
module.exports = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:5173", // Adjust the URL as needed
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id);
        // Join a room for private conversation
        socket.on("join room", ({ roomId }) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });
        // Handle chat message event with username and roomId
        socket.on("chat message", (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, username, message }) {
            // Save message to database
            yield messageModel_1.default.create({ roomId, username, message, timestamp: new Date() });
            // Emit the message to the specific room
            io.to(roomId).emit("chat message", { username, message });
        }));
        // Handle user disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected: " + socket.id);
        });
    });
    return io;
};
//# sourceMappingURL=socket_server.js.map