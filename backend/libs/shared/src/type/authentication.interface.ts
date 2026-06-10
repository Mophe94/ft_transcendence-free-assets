import { Request } from "express";
import { WebSocket } from "ws";

export interface AuthenticatedUser {
  id: number;
}
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export interface AuthenticatedSocket extends WebSocket {
  user: AuthenticatedUser;
}

export interface CustomWsClient {
  user?: AuthenticatedUser;
  handshake: {
    headers: {
      cookie?: string;
    };
  };
}
