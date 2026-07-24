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
  FULL,
  PHASE_DURATIONS,
  createMockUser,
} from 'apps/game-service/src/game/game.type';
import { LobbyService } from 'apps/game-service/src/lobby/lobby.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { RedisService } from '../redis/redis.service';

@WebSocketGateway(8081, { cors: { origin: true }, path: '/lobby' })
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private lobbyService: LobbyService,
    private roomService: RoomService,
    private redisService: RedisService,
  ) {}

  handleConnection(client: WebSocket): void {
    const { userId } = createMockUser();
    clientsMap.set(client, { userId, isAlive: true });
    console.log('[LobbyGateway]: Client connected');
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
    this.lobbyService.joinLobby(client, clientData.userId);
  }

  @OnEvent('lobby.player_joined')
  onPlayerJoigned({
    clients,
    roomId,
    playerCount,
  }: {
    clients: Set<WebSocket>;
    roomId: string;
    playerCount: number;
  }): void {
    this.broadcast(clients, {
      event: 'lobby',
      state: 'player_joigned',
      data: { roomId, playerCount, maxPlayers: FULL },
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
    const serverTime = Math.floor(Date.now() / 1000);

    this.broadcast(clients, {
      event: 'game',
      state: 'start_game',
      data: {
        roomId: roomId,
      },
    });
  }
}
