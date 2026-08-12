import { WebSocket } from 'ws';

// shared between LobbyService and RoomService
export interface ClientData {
  userId: number;
  roomId?: string;
  isAlive: boolean;
}

export const clientsMap = new Map<WebSocket, ClientData>();
