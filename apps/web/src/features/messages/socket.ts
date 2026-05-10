import { io } from 'socket.io-client';

// This establishes the persistent WebSocket tunnel for real-time delivery
const socket = io('http://localhost:3000', {
  autoConnect: false,
});

export default socket;