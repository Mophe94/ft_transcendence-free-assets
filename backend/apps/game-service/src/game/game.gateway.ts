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
import {
  GamePayload,
  PHASE_DURATIONS,
  PhaseName,
  createMockUser,
} from './game.type';
import { ClientData } from 'apps/game-service/src/shared/clients.map';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { FULL_LOBBY } from 'apps/game-service/src/game/game.type';
import { IncomingMessage } from 'http';
import { intervalProvider } from 'node_modules/rxjs/dist/types/internal/scheduler/intervalProvider';

@WebSocketGateway(8082, { cors: { origin: true }, path: '/game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
  ) {}
  private clients = new Map<WebSocket, ClientData>();

  handleConnection(client: WebSocket, request: IncomingMessage): void {
    const url = request.url!;
    const params = new URLSearchParams(url.split('?')[1]);
    const token = params.get('token');
    const roomId = params.get('room');
    console.log(url);
    console.log(token);
    console.log(roomId);
    // Add JWT token validation
    const { userId } = createMockUser();
    if (
      !token ||
      !roomId
      //|| !this.gameService.isPlayerInRoom(user.sub, roomId)
    ) {
      console.log('Missing token to authenticate');
      client.close();
      return;
    }

    this.clients.set(client, { userId, roomId, isAlive: true });
    console.log(`Client ${userId} connected in room ${roomId}`);

    client.on('pong', () => {
      console.log('pong received');
      const data = this.clients.get(client);
      if (data) data.isAlive = true; //
    });

    this.gameService
      .onGodotConnected(client, userId, roomId)
      .then((payload) => {
        if (payload) {
          this.sendToClient(client, payload);
        }
      })
      .catch((err) => {
        console.log('handleConnection error');
        client.close();
      });
  }

  handleDisconnect(client: WebSocket): void {
    const user = this.clients.get(client);
    this.clients.delete(client);
    console.log(`Client ${user?.userId} disconnected`);
  }

  private broadcast(clients: Set<WebSocket>, message: object) {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN)
        client.send(JSON.stringify(message));
    });
  }

  private sendToClient(client: WebSocket, message: object) {
    if (client.readyState === WebSocket.OPEN)
      client.send(JSON.stringify(message));
  }

  @Interval(10000)
  private heartbeat() {
    this.clients.forEach((data, socket) => {
      if (!data.isAlive) {
        socket.terminate();
        this.clients.delete(socket);
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

    const response = await this.gameService.handleMessage(userId, payload);
    this.sendToClient(client, response);
  }
}
