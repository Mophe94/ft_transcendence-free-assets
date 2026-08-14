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
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { clientsMap } from 'apps/game-service/src/shared/clients.map';
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
    private readonly eventEmitter: EventEmitter2,
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
    const userId = clientData?.userId.toString();
    if (clientData?.roomId && userId) {
      void this.notifyRoomOnLeave(client, clientData.roomId, userId);
      console.log('LEAVEROOM');
    }
    clientsMap.delete(client);
    console.log('[LobbyGateway]: Client disconnected');
  }

  private async notifyRoomOnLeave(
    client: WebSocket,
    roomId: string,
    userId: string,
  ): Promise<void> {
    const remainingClients = await this.roomService.leaveRoom(client, roomId, userId);
    if (remainingClients) {
      this.eventEmitter.emit('lobby.player_joined', {
        clients: remainingClients,
        roomId,
        playerCount: remainingClients.size,
      });
    }
  }

  private broadcast(clients: Set<WebSocket>, message: object) {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN)
        client.send(JSON.stringify(message));
    });
  }

 @SubscribeMessage('create_room')
  async handleCreateRoom(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() payload: { username: string; avatar: string },
  ): Promise<void> {
    const clientData = clientsMap.get(client);
    if (!clientData) {
      client.close();
      return;
    }
    await this.lobbyService.createRoomAndJoin(
      client,
      clientData.userId,
      payload.username,
      payload.avatar,
    );
  }

  @SubscribeMessage('quick_pairing')
  async handleQuickPairing(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() payload: { username: string; avatar: string },
  ): Promise<void> {
    const clientData = clientsMap.get(client);
    if (!clientData) {
      client.close();
      return;
    }
    await this.lobbyService.quickPairing(
      client,
      clientData.userId,
      payload.username,
      payload.avatar,
    );
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() payload: { roomId: string; username: string; avatar: string },
  ): Promise<void> {
    const clientData = clientsMap.get(client);
    if (!clientData) {
      client.close();
      return;
    }
    await this.lobbyService.joinRoom(
      client,
      clientData.userId,
      payload.roomId,
      payload.username,
      payload.avatar,
    );
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
    const players = await this.redisService.getPlayersFromRoom(roomId);
    this.broadcast(clients, {
      event: 'lobby',
      state: 'player_joined',
      data: { roomId, playerCount, roomCapacity, timer, players },
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
    this.broadcast(clients, {
      event: 'game',
      state: 'start_game',
      data: {
        roomId: roomId,
      },
    });
  }
}