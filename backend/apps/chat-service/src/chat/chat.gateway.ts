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
    this.logger.log('[WS INIT] Heartbeat check interval initialized (30s)');
    this.heartbeatInterval = setInterval(() => {
      server.clients.forEach((wsClient: WebSocket) => {
        const client = wsClient as HeartbeatSocket;
        if (client.isAlive === false) {
          this.logger.warn(
            `[WS HEARTBEAT] Terminating inactive connection. Socket: ${client.id || 'unknown'} - User: ${client.user?.id || 'unknown'}`,
          );
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
    const clientIp = this.extractClientIp(request);
    try {
      const user = await this.wsAuthService.verifyWsHandshake(request);

      if (!user.id) {
        this.logger.warn(
          `[WS REJECTED] Handshake succeeded but missing user ID. IP: ${clientIp}. Closing connection.`,
        );
        client.close(1008, 'Unauthorized');
        return;
      }
      this.logger.log(
        `[WS USER IDENTIFIED] User: ${user.username} (${user.id}) - IP: ${clientIp}`,
      );
      client.id = randomUUID();
      client.user = user;
      this.logger.log(
        `[WS MAPPING] Association Socket: ${client.id} -> User: ${client.user.id}`,
      );
      this.chatService.addConnection(client.user.id, client.id);
      client.isAlive = true;
      client.on('pong', () => {
        client.isAlive = true;
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `[WS CONNECT FAILED] Connection initiation failed: ${reason} - IP: ${clientIp}`,
      );
      client.close(1008, 'Unauthorized');
    }
  }

  handleDisconnect(client: HeartbeatSocket) {
    if (!client?.user || client.id === undefined) {
      this.logger.warn(
        '[WS DISCONNECT] Disconnected client missing user session or socket ID.',
      );
      return;
    }
    this.chatService.removeConnection(client.user.id, client.id);
    this.logger.log(
      `[WS DISCONNECTED] Socket: ${client.id} -> User: ${client.user.id}`,
    );
  }

  @SubscribeMessage('message')
  handleMessage(client: AuthenticatedSocket, content: string) {
    this.logger.log(
      `[WS MESSAGE] Received from User: ${client.user?.username} (${client.user?.id}) - Socket: ${client.id}`,
    );
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
    let recipientCount = 0;
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
        recipientCount++;
      }
    });
    const msgType = (message as { type?: string }).type || 'UNKNOWN';
    this.logger.log(
      `[WS BROADCAST] Event: ${msgType} -> Sent to ${recipientCount} active client(s)`,
    );
  }

  private extractClientIp(req: IncomingMessage): string {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      const ips = (
        Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor
      ).split(',');
      return ips[0].trim();
    }
    return req.socket.remoteAddress || 'unknown';
  }

  sendNotifToUser(userId: string, type: MessageEvent, origin: object) {
    const sockets = this.chatService.getUserSockets(userId);
    if (!sockets || sockets.length === 0) {
      this.logger.log(
        `[WS NOTIFY SKIPPED] User: ${userId} has no active sockets.`,
      );
      return false;
    }
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
        client.send(payload);
        sentCount++;
      }
    });

    if (sentCount > 0) {
      this.logger.log(
        `[WS NOTIFY SUCCESS] Event: ${type} -> Delivered to ${sentCount}/${sockets.length} socket(s) for User: ${userId}`,
      );
    } else {
      this.logger.warn(
        `[WS NOTIFY FAILED] Event: ${type} -> Sockets found (${sockets.length}) but none were OPEN for User: ${userId}`,
      );
    }

    return sentCount > 0;
  }
}
