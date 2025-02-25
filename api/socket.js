import { Server } from 'socket.io';
import http from 'http';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const httpServer = http.createServer();
    const io = new Server(httpServer, {
      path: '/socket.io'
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Room creation
      socket.on('create_room', ({ name }) => {
        const roomId = Math.random().toString(36).substring(2, 8);
        socket.join(roomId);
        socket.emit('room_created', { roomId });
      });

      // Joining a room
      socket.on('join_room', ({ roomId, playerData }) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        if (room && room.size < 2) {
          socket.join(roomId);
          socket.emit('joined_room', { roomId });
          const players = Array.from(room).map((id) => ({
            id,
            name: id === socket.id ? playerData.name : 'Opponent',
          }));
          io.to(roomId).emit('battle_ready', { players });
        } else {
          socket.emit('error', { message: 'Room full or does not exist' });
        }
      });

      // Battle actions
      socket.on('battle_action', ({ roomId, action }) => {
        socket.to(roomId).emit('opponent_action', action);
      });

      // Team selection
      socket.on('team_selected', ({ roomId, team }) => {
        socket.to(roomId).emit('opponent_team', { team });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        socket.broadcast.emit('opponent_disconnected');
      });
    });
  }
  res.end();
}
