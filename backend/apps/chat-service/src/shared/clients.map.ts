import { AuthenticatedUser } from 'libs/shared/src';
import { WebSocket } from 'ws';

export const clientsMap = new Map<WebSocket, AuthenticatedUser>();
