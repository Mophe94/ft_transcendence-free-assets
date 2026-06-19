import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import type { AuthenticatedSocket, AuthenticatedUser } from 'libs/shared/src';
import { wsAuthService } from 'libs/shared/src/auth/ws-auth.service';
import { ConfigService } from '@nestjs/config';
import { Server, WebSocket } from 'ws';
import { clientsMap } from '../shared/clients.map';

@WebSocketGateway({ cors: { origin: '*' }, path: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private configService: ConfigService,
    private wsAuthService: wsAuthService,
  ) {}

  async handleConnection(
    client: AuthenticatedSocket,
    request: IncomingMessage,
  ): Promise<void> {
    try {
      const user = await this.wsAuthService.authenticateClient(client, request);
      client.user = user;
      clientsMap.set(client, user);
    } catch {
      client.close(1008, 'Unauthorized');
    }
    console.log(`New connection: ${client.user} ${client.user}`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    clientsMap.delete(client);
    console.log(`disconnection: ${client.user.username}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: AuthenticatedSocket, content: string): string {
    const date = new Date();
    const sender = client.user.username;

    const message = { time: date, username: sender, content };
    this.broadcast(message);
    return 'Hello world!';
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
