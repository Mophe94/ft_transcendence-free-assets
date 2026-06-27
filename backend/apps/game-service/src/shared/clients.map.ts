import { WebSocket } from 'ws';

export interface ClientData {
  userId: number;
  roomId?: string;
  isAlive: boolean;
}

export const clientsMap = new Map<WebSocket, ClientData>();
