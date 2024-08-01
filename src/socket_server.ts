import { Server } from 'socket.io';
import http from 'http';
import { saveMessage } from './controllers/roomController';
import Message from './models/messageModel';

export = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "10.10.248.166",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on('join room', async (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);

      // Fetch and emit previous messages
      const messages = await Message.find({ roomId: room }).sort({ timestamp: 1 });
      socket.emit('previous messages', messages);
    });

    socket.on('leave room', (room) => {
      socket.leave(room);
      console.log(`User ${socket.id} left room ${room}`);
    });

    // The message is logged, saved to the database, and broadcast to all users in the room
    socket.on('chat message', async ({ username, message, room }) => {
      console.log('Received message:', { username, message, room });
      await saveMessage({ roomId: room, username, message });
      io.to(room).emit('chat message', { username, message });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected: ' + socket.id);
    });

    socket.onAny((eventName, args) => {
      console.log("Event: " + eventName);
      socket.emit("echo", args);
    });
  });

  return io;
}
