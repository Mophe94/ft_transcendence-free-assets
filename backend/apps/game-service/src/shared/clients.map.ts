import { WebSocket } from 'ws';

export interface ClientData {
  userId: string;
  roomId?: string;
  isAlive: boolean;
}

export const clientsMap = new Map<WebSocket, ClientData>();
