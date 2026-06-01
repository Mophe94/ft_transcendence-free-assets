import { WebSocket } from "ws";

export interface ClientData {
  user: {
    sub: number;
    username: string;
  }
  roomId?: string;
}

export const clientsMap = new Map<WebSocket, ClientData>();