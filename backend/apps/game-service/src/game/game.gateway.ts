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
import { GameService } from './game.service';
import { PlayerService } from './player/player.service';
import { GamePayload, PHASE_DURATIONS, PhaseName, createMockUser } from './game.type';
import { ClientData, clientsMap } from 'apps/game-service/src/shared/clients.map';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { FULL_LOBBY } from 'apps/game-service/src/game/game.type';
import { IncomingMessage } from 'http';

@WebSocketGateway(8082, { cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private gameService: GameService, private playerService: PlayerService) {}

  handleConnection(client: WebSocket, request: IncomingMessage): void {
    const url = request.url!;
    const params = new URLSearchParams(url.split('?')[1]);
    const token = params.get('token');
    const roomId = params.get('room');
    console.log(url);
    console.log(token);
    console.log(roomId);
    // Add JWT token validation
    const user = createMockUser();
    if (!token || !roomId || !this.gameService.isPlayerInRoom(user.sub, roomId)) {
      console.log("Missing token to authenticate");
      client.close();
      return;
    }

    clientsMap.set(client, { user, roomId });
    console.log(`Client ${user.sub} connected in room ${roomId}`);

    const payload = this.gameService.onGodotConnected(client, user.sub, roomId);
    if (payload) {
      this.sendToClient(client, payload);
    }
  }

  handleDisconnect(client: WebSocket): void {
    const user = clientsMap.get(client);
    clientsMap.delete(client);
    console.log(`Client ${user?.user.sub} disconnected`);
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

  @SubscribeMessage('game')
  async handleGame(@ConnectedSocket() client: WebSocket, @MessageBody() payload: any,): Promise<void> {
    // create a GamePayload interface to avoid 'any'?
    const clientData = clientsMap.get(client);
    if (!clientData) {
      client.close();
      return;
    }

/*     // Dispatch "State" exemple
    switch (payload.state) {
      case 'end_map':
        await this.gameService.handleEndMap(userId, payload);
        break;
      default:
        client.send(
          JSON.stringify({
            event: 'game',
            state: 'action_rejected',
            data: { reason: 'invalid_action' },
          }),
        );
    } */
  }
}
