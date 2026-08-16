import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Interval } from '@nestjs/schedule';
import { WebSocket, Server } from 'ws';
import { GameService } from './game.service';
import { PlayerService } from './player/player.service';
import { GamePayload } from './game.type';
import { ClientData } from 'apps/game-service/src/shared/clients.map';
import { IncomingMessage } from 'http';
import { OnEvent } from '@nestjs/event-emitter';
import { RedisStateService } from '../redis/redis_state.service';
import { SharedAuthService } from 'libs/shared/src/auth/shared-auth.service';

@WebSocketGateway(8082, { cors: { origin: true }, path: '/game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private wsAuthService: SharedAuthService,
    private playerService: PlayerService,
    private redisStateService: RedisStateService,
    private gameService: GameService,
  ) {}
  private clients = new Map<WebSocket, ClientData>();
  private clientsById = new Map<string, WebSocket>();

  async handleConnection(
    client: WebSocket,
    request: IncomingMessage,
  ): Promise<void> {
    const url = request.url!;
    const params = new URLSearchParams(url.split('?')[1]);
    const token = params.get('token');
    const roomId = params.get('room');
    console.log(url);
    console.log(token);
    console.log(roomId);
    // Add JWT token validation

    const user = await this.wsAuthService.verifyWsHandshake(request);
    if (!user.username) {
      client.close(1008, 'Unauthorized');
      return;
    }
    const userId = user.username;
    if (
      !token ||
      !roomId
      //|| !this.gameService.isPlayerInRoom(user.sub, roomId)
    ) {
      console.log('[GameGateway]: Missing token to authenticate');
      client.close();
      return;
    }

    this.clients.set(client, { userId, roomId, isAlive: true });
    this.clientsById.set(userId!, client);
    console.log(`[GameGateway]: Client ${userId} connected in room ${roomId}`);

    client.on('pong', () => {
      console.log('pong received');
      const data = this.clients.get(client);
      if (data) data.isAlive = true; //
    });

    this.gameService.onGodotConnected(client, userId, roomId).catch((err) => {
      console.log('[GameGateway]: handleConnection error');
      client.close();
    });
  }

  handleDisconnect(client: WebSocket): void {
    this.cleanupClient(client);
  }

  private cleanupClient(client: WebSocket): void {
    const user = this.clients.get(client);
    this.clients.delete(client);
    if (!user) return;

    this.clientsById.delete(user.userId);

    if (user.roomId) {
      this.gameService.onGodotDisconnected(user.userId, user.roomId);
    }
    console.log(`[GameGateway]: Client ${user?.userId} disconnected`);
  }

  private broadcast(clients: Set<WebSocket>, message: object) {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN)
        client.send(JSON.stringify(message));
    });
  }

  private sendToClient(client: WebSocket, message: object | undefined) {
    if (client.readyState === WebSocket.OPEN) {
      console.log("Send_Gateway: " , message);
      client.send(JSON.stringify(message));
    }
  }

  @Interval(10000)
  private heartbeat() {
    this.clients.forEach((data, socket) => {
      if (!data.isAlive) {
        socket.terminate();
        this.cleanupClient(socket);
        console.log(`[Heartbeat]: client ${data.userId} terminated`);
        return;
      }
      data.isAlive = false;
      socket.ping();
    });
  }

  @SubscribeMessage('game')
  async handleGame(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() payload: any,
  ): Promise<void> {
    // create a GamePayload interface to avoid 'any'?
    const clientData = this.clients.get(client);
    if (!clientData) {
      client.close();
      return;
    }

    const userId = clientData.userId;

    let response = await this.gameService.handleMessage(userId, payload);
    if (!response) {
      response = {
        event: 'game',
        data: {
          state: 'undefined payload',
        },
      };
    }
    this.sendToClient(client, response);

    /////////////////////////////////* REDIS STATE : UPDATE STATE */////////////////////////////////
    const playerState = this.playerService.getPlayer(userId)!;
    await this.redisStateService.updateStatePlayer(
      userId.toString(),
      playerState,
    );
    /////////////////////////////////* END */////////////////////////////////
  }

  /* ----------- EVENTS ----------- */

  @OnEvent('send_to_player')
  onSendToPlayer({
    userId,
    payload,
  }: {
    userId: string;
    payload: object;
  }): void {
    const client = this.clientsById.get(userId);
    if (client) {
      this.sendToClient(client, payload);
    }
  }

  @OnEvent('send_to_room')
  onSendToRoom({
    clients,
    payload,
  }: {
    clients: Set<WebSocket>;
    payload: object;
  }): void {
    this.broadcast(clients, payload);
  }

  @OnEvent('close_player_socket')
  onClosePlayerSocket({ userId }: { userId: string }): void {
    const client = this.clientsById.get(userId);
    if (client) client.close(); // trigger handleDisconnect -> cleanupClient
  }
}
