import { environment } from "../environments/environment";

let socket: WebSocket | null = null;

export const connectWebSocket = () => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(`${environment.be.wsUrl}/ws`);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  return socket;
};

export const getSocket = () => socket;

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
  }
};