const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
import { Message } from './shared/interfaces/types';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }, // Allow CORS for development
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Informs that the user has connected
  io.emit('userConnected', { userId: socket.id });

  // Listening for messages from the client and broadcasting them to all clients
  socket.on('message', (msg: Message) => {
    io.emit('message', { userId: msg.username, difficulty: msg.difficulty, gameId: msg.gameId });
  });

  socket.on('newGame', (msg: Message) => {
    io.emit('newGame', { userId: msg.username, difficulty: msg.difficulty, gameId: msg.gameId });
  });

  socket.on('joinGame', (msg: Message) => {
    io.emit('joinGame', { userId: msg.username, difficulty: msg.difficulty, gameId: msg.gameId });
  });

  socket.on('disconnect', (reason: string) => {
    console.log('User disconnected:', socket.id, reason);
    io.emit('userDisconnected', socket.id);
  });
});

server.listen(9000, () => {
  console.log('Socket.IO server running on http://localhost:9000');
});
