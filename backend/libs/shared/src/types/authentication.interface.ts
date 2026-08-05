import { WebSocket } from 'ws';
import { JwtPayload } from './jwt-payload.interface';

export interface AuthenticatedSocket extends WebSocket {
  user?: JwtPayload;
}
