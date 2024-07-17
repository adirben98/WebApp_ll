import { Server } from "socket.io";
import http from "http";

export = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Adjust the URL as needed
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Handle chat message event
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected: ' + socket.id);
    });

    // Other custom event handlers
    socket.onAny((eventName, args) => {
      console.log("Event: " + eventName);
      socket.emit("echo", args);
    });
  });

  return io;
}
