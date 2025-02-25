// pages/api/socket.js
import { Server } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }
  
  const io = new Server(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
  });
  
  res.socket.server.io = io;
  
  // Room tracking
  const activeRooms = new Map();
  
  io.on('connection', socket => {
    console.log(`Player connected: ${socket.id}`);
    
    // Create a new battle room
    socket.on('create_room', (playerData) => {
      const roomId = generateRoomId();
      socket.join(roomId);
      
      activeRooms.set(roomId, {
        creator: socket.id,
        creatorData: playerData,
        opponent: null,
        gameState: 'waiting'
      });
      
      socket.emit('room_created', { roomId });
    });
    
    // Handle joining rooms
    socket.on('join_room', ({ roomId, playerData }) => {
      const room = activeRooms.get(roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }
      
      socket.join(roomId);
      room.opponent = socket.id;
      room.opponentData = playerData;
      room.gameState = 'ready';
      
      socket.emit('joined_room', { roomId });
      io.to(roomId).emit('battle_ready', {
        players: [room.creatorData, playerData]
      });
    });
    
    socket.on('battle_action', ({ roomId, action }) => {
      socket.to(roomId).emit('opponent_action', action);
    });
    
    socket.on('team_selected', ({ roomId, team }) => {
      socket.to(roomId).emit('opponent_team', { team });
    });
    
    socket.on('disconnect', () => {
      console.log('Player disconnected');
    });
  });
  
  function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  console.log('Socket server initialized');
  res.end();
}
