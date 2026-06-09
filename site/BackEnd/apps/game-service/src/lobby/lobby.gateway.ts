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
import { LobbyService } from './lobby.service';
import { clientsMap } from 'apps/game-service/src/shared/clients.map';
import {
  FULL_LOBBY,
  PHASE_DURATIONS,
  createMockUser,
} from 'apps/game-service/src/game/game.type';

@WebSocketGateway(8080 /* { cors: true } */)
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private lobbyService: LobbyService) {}

  handleConnection(client: WebSocket): void {
    clientsMap.set(client, { user: createMockUser() });
    console.log('[LobbyGateway] Client connected');
  }

  handleDisconnect(client: WebSocket): void {
    const clientData = clientsMap.get(client);
    if (clientData?.roomId)
      this.lobbyService.leaveRoom(client, clientData.roomId);
    clientsMap.delete(client);
    console.log('[LobbyGateway] Client disonnected');
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
    this.lobbyService.joinLobby(client, clientData.user);
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
      data: { roomId, playerCount, maxPlayers: FULL_LOBBY },
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
      state: 'map_enter',
      data: {
        server_time: serverTime,
        time_duration: PHASE_DURATIONS.map,
        map: 'forest_map', //TODO add winning map
      },
    });
  }
}
