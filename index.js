import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);
let playerCount = 0;
const players = {};  // Store socket IDs and user IDs

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});


io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
      socket.broadcast.emit('toggle button');
      let index = msg[msg.length - 1];
      if (index > 21) {
        socket.broadcast.emit('winMessage');
      }
    });
    socket.on('restart', () => {
      io.emit('restart');
    })
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});