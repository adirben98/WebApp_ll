// socket_server.ts
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import Message from "./models/messageModel"; // Assume Message is a Mongoose model

export = (server: http.Server) => {
  const io = new Server(server, {
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
    socket.on("chat message", async ({ roomId, username, message }) => {
      // Save message to database
      await Message.create({ roomId, username, message, timestamp: new Date() });

      // Emit the message to the specific room
      io.to(roomId).emit("chat message", { username, message });
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });
  });

  return io;
}
