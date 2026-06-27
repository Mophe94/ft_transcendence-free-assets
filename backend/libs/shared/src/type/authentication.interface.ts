import { UserRole } from 'apps/account-service/src/users/types/userRole.enum';
import { Request } from 'express';
import { WebSocket } from 'ws';

export interface AuthenticatedUser {
  id: number;
  username: string;
  role: UserRole;
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
