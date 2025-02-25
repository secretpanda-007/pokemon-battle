import { Server } from 'socket.io';

export default function SocketHandler(req, res) {
  // Don't start server twice
  if (res.socket.server.io) {
    console.log('Socket server already running');
    res.end();
    return;
  }
  
  // Initialize Socket.IO server
  const io = new Server(res.socket.server);
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
      
      // Send room code to creator
      socket.emit('room_created', { roomId });
      console.log(`Room created: ${roomId}`);
    });
    
    // Join existing battle room
    socket.on('join_room', ({ roomId, playerData }) => {
      const room = activeRooms.get(roomId);
      
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }
      
      if (room.opponent) {
        socket.emit('error', { message: 'Room is full' });
        return;
      }
      
      socket.join(roomId);
      room.opponent = socket.id;
      room.opponentData = playerData;
      room.gameState = 'ready';
      
      // Notify both players
      socket.emit('joined_room', { roomId });
      io.to(roomId).emit('battle_ready', {
        players: [room.creatorData, playerData]
      });
      
      console.log(`Player ${socket.id} joined room ${roomId}`);
    });
    
    // Handle battle actions
    socket.on('battle_action', ({ roomId, action }) => {
      const room = activeRooms.get(roomId);
      if (!room) return;
      
      // Forward action to other player in room
      socket.to(roomId).emit('opponent_action', action);
    });
    
    // Handle team selection
    socket.on('team_selected', ({ roomId, team }) => {
      socket.to(roomId).emit('opponent_team', { team });
    });
    
    // Handle player disconnect
    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);
      
      // Find and clean up rooms involving this player
      activeRooms.forEach((room, roomId) => {
        if (room.creator === socket.id || room.opponent === socket.id) {
          io.to(roomId).emit('opponent_disconnected');
          activeRooms.delete(roomId);
        }
      });
    });
  });
  
  // Generate a random room ID
  function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  console.log('Socket server started');
  res.end();
}
