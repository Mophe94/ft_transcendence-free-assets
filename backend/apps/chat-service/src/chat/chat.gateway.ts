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
import { MessageEvent } from './const/messageEvent';
import { Logger } from '@nestjs/common';

type HeartbeatSocket = AuthenticatedSocket & { isAlive?: boolean };

@WebSocketGateway({ cors: { origin: '*' }, path: '/chat' })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server!: Server;
  private heartbeatInterval!: NodeJS.Timeout;

  private readonly logger = new Logger(ChatGateway.name);

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
      this.logger.log('Opening websocket connection. Verifying handshake...');
      const user = await this.wsAuthService.verifyWsHandshake(request);

      if (!user.id) {
        this.logger.error('Invalid Id. Closing connection.');
        client.close(1008, 'Unauthorized');
        return;
      }
      this.logger.log(`User identified: ${user.username}`);
      client.id = randomUUID();
      client.user = user;
      this.logger.log('Mapping connection...');
      this.chatService.addConnection(client.user.id, client.id);
      client.isAlive = true;
      client.on('pong', () => {
        client.isAlive = true;
      });
    } catch (error) {
      this.logger.log(`Connection initiation failed: ${error}`);
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

    const message = {
      type: MessageEvent.CHAT_MESSAGE,
      time: date,
      username: sender,
      content,
    };
    this.broadcast(message);
  }

  private broadcast(message: object) {
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  sendNotifToUser(userId: string, type: MessageEvent, origin: object) {
    this.logger.log(`Checking destinatory status...`);
    const sockets = this.chatService.getUserSockets(userId);
    if (!sockets || sockets.length === 0) {
      this.logger.log(
        'Destinatory not found in currently connected users. Aborting.',
      );
      return false;
    }
    this.logger.log(`Found ${sockets.length} sockets for destinatory.`);
    const socketIds = new Set(sockets.map((c) => c.socketId));
    const payload = JSON.stringify({
      type,
      origin,
      time: new Date().toISOString(),
    });

    let sentCount = 0;

    this.server.clients.forEach((client: HeartbeatSocket) => {
      if (
        client.id &&
        socketIds.has(client.id) &&
        client.readyState === WebSocket.OPEN
      ) {
        this.logger.log(`Sending notification to ${client.id}`);
        client.send(payload);
        sentCount++;
      }
    });

    return sentCount > 0;
  }
}
