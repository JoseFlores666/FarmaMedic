import { io } from 'socket.io-client';

export const socket = io('https://localhost:4000', {
  withCredentials: true,
});
