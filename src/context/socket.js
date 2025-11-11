import { io } from 'socket.io-client';

export const socket = io('https://back-farmam.onrender.com', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});
