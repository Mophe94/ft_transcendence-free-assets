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
import { Server, WebSocket } from 'ws';
import { SharedAuthService } from 'libs/shared/src/auth/shared-auth.service';
import { ChatService } from './chat.service';
import { randomUUID } from 'crypto';

type HeartbeatSocket = AuthenticatedSocket & { isAlive?: boolean };

@WebSocketGateway({ cors: { origin: '*' }, path: '/chat' })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server!: Server;
  private heartbeatInterval!: NodeJS.Timeout;

  constructor(
    private wsAuthService: SharedAuthService,
    private readonly chatService: ChatService,
  ) {}
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
      client.id = randomUUID();
      if (!user.id) {
        client.close(1008, 'Unauthorized');
      }
      console.log('hello');
      client.user = user;
      this.chatService.addConnection(client.user.id, client.id);
      client.isAlive = true;
      client.on('pong', () => {
        client.isAlive = true;
      });
    } catch {
      client.close(1008, 'Unauthorized');
    }
  }

  handleDisconnect(client: HeartbeatSocket) {
    if (!client?.user || client.id === undefined) return;
    this.chatService.removeConnection(client.user.id, client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: AuthenticatedSocket, content: string) {
    const date = new Date();
    const sender = client.user?.username;

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
