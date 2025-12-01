import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: true,
  },
});

io.on('connection', (socket) => {
  // TODO: updates the user's board
});

httpServer.listen(9000);
