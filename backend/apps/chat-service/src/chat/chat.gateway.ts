import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import type { AuthenticatedSocket } from 'libs/shared/src';
import { ConfigService } from '@nestjs/config';
import { Server, WebSocket } from 'ws';
import { clientsMap } from '../shared/clients.map';
import { UseGuards } from 'node_modules/@nestjs/common';
import { SharedAuthService } from 'libs/shared/src/auth/shared-auth.service';

type HeartbeatSocket = AuthenticatedSocket & { isAlive?: boolean };

@WebSocketGateway({ cors: { origin: '*' }, path: '/chat' })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server!: Server;
  private heartbeatInterval!: NodeJS.Timeout;

  constructor(private wsAuthService: SharedAuthService) {}
  destroy() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }

  afterInit(server: Server) {
    this.heartbeatInterval = setInterval(() => {
      server.clients.forEach((wsClient: WebSocket) => {
        const client = wsClient as HeartbeatSocket;
        if (client.isAlive === false) {
          return client.terminate();
        }
        client.isAlive = false;

        if (client.readyState === WebSocket.OPEN) {
          client.ping();
        }
      });
    }, 30000);
  }

  async handleConnection(
    client: HeartbeatSocket,
    request: IncomingMessage,
  ): Promise<void> {
    try {
      const user = await this.wsAuthService.verifyWsHandshake(request);
      client.user = user;
      clientsMap.set(client, user);
      client.isAlive = true;
      client.on('pong', () => {
        client.isAlive = true;
      });
    } catch {
      client.close(1008, 'Unauthorized');
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    clientsMap.delete(client);
    console.log(`disconnection: ${client.user.username}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: AuthenticatedSocket, content: string) {
    const date = new Date();
    const sender = client.user.username;

    const message = { time: date, username: sender, content };
    this.broadcast(message);
  }

  private broadcast(message: object) {
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
        console.log('message sent');
      }
    });
  }
}
