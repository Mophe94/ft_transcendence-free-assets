import { WebSocket } from 'ws';

// shared between LobbyService and RoomService
export interface ClientData {
  userId: string;
  roomId?: string;
  isAlive: boolean;
  pendingJoin?: boolean;
}

export const clientsMap = new Map<WebSocket, ClientData>();
