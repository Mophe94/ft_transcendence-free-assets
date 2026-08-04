import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { WebSocket, Server } from 'ws';
import { OnEvent } from '@nestjs/event-emitter';
import { clientsMap } from 'apps/game-service/src/shared/clients.map';
import {
  PHASE_DURATIONS,
  createMockUser,
} from 'apps/game-service/src/game/game.type';
import { LobbyService } from 'apps/game-service/src/lobby/lobby.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { RedisService } from '../redis/redis.service';
import { WsAuthService } from 'libs/shared/src/auth/ws-auth.service';
import { IncomingMessage } from 'http';

@WebSocketGateway(8081, { cors: { origin: true }, path: '/lobby' })
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private lobbyService: LobbyService,
    private roomService: RoomService,
    private redisService: RedisService,
    private readonly wsAuthService: WsAuthService,
  ) {}

  async handleConnection(
    client: WebSocket,
    request: IncomingMessage,
  ): Promise<void> {
    try {
      const user = await this.wsAuthService.authenticateClient(client, request);
      clientsMap.set(client, { userId: user.id, isAlive: true });
      console.log('[LobbyGateway]: Client connected');
    } catch {
      client.close(4001, 'Unauthorized');
    }
  }

  handleDisconnect(client: WebSocket): void {
    const clientData = clientsMap.get(client);
    if (clientData?.roomId) {
      this.roomService.leaveRoom(client, clientData.roomId);
      console.log('LEAVEROOM');
    }
    clientsMap.delete(client);
    console.log('[LobbyGateway]: Client disconnected');
  }

  private broadcast(clients: Set<WebSocket>, message: object) {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN)
        client.send(JSON.stringify(message));
    });
  }

  @SubscribeMessage('lobby')
  handleLobby(@ConnectedSocket() client: WebSocket): void {
    const clientData = clientsMap.get(client);
    if (!clientData) {
      client.close();
      return;
    }
    void this.lobbyService.joinLobby(client, clientData.userId);
  }

  @OnEvent('lobby.player_joined')
  async onPlayerJoined({
    clients,
    roomId,
    playerCount,
  }: {
    clients: Set<WebSocket>;
    roomId: string;
    playerCount: number;
  }): Promise<void> {
    const timer = await this.redisService.getRoomTimer(roomId);
    const roomCapacity = await this.redisService.getRoomCapacity(roomId);
    this.broadcast(clients, {
      event: 'lobby',
      state: 'player_joined',
      data: { roomId, playerCount, roomCapacity, timer },
    });
  }

  @OnEvent('lobby.start')
  onStart({
    roomId,
    clients,
  }: {
    roomId: string;
    clients: Set<WebSocket>;
  }): void {
    this.startGame(roomId, clients);
  }

  private startGame(roomId: string, clients: Set<WebSocket>): void {
    const serverTime = Math.floor((Date.now() + 50000) / 1000);

    this.broadcast(clients, {
      event: 'game',
      state: 'start_game',
      data: {
        roomId: roomId,
        startTime: serverTime,
      },
    });
  }
}
