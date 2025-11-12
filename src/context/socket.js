// https://localhost:4000/api
// https://back-farmam.onrender.com/api
import { io } from 'socket.io-client';

export const socket = io('https://back-farmam.onrender.com', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});
