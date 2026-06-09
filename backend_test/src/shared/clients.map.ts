import { WebSocket } from "ws";

export interface ClientData {
  user: {
    sub: number;
  }
  roomId?: string;
}

export const clientsMap = new Map<WebSocket, ClientData>();