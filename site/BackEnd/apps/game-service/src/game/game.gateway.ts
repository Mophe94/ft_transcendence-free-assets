import {
  SubscribeMessage, WebSocketGateway,
  OnGatewayConnection, OnGatewayDisconnect,
  WebSocketServer, ConnectedSocket, MessageBody 
} from '@nestjs/websockets';
import { WebSocket, Server } from 'ws';
import { GameService } from './game.service';
import { GamePayload, PHASE_DURATIONS,  PhaseName, createMockUser} from './game.type';
import { ClientData, clientsMap } from 'apps/game-service/src/shared/clients.map';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { IncomingMessage } from 'http';


@WebSocketGateway(8082, /* { cors: true } */)
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server : Server;

  constructor(private gameService: GameService) {}
  
  handleConnection(client: WebSocket, request: IncomingMessage): void {
    let url = request.url;
    console.log(url);
    // Replace by JWT token validation!
    let roomId = 'test-room';
    const user = createMockUser();
    if (!roomId || !this.gameService.isPlayerInRoom(user.sub, roomId)) {
      client.close();
      return;
    }
    clientsMap.set(client, { user, roomId });
    console.log(`Client ${user.sub} connected in room ${roomId}`);

    // Implement addPlayerToRoom in GameService
    // if FULL_LOBBY -> startMapPhase(roomId) + send phase state to Godot
  }

  handleDisconnect(client: WebSocket): void {
    clientsMap.delete(client);
    console.log('Client disonnected');
  }


  private broadcast(clients : Set<WebSocket>, message : object) {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN)
        client.send(JSON.stringify(message));
    })
  }

  private sendToClient (client : WebSocket, message : object) {
      if (client.readyState === WebSocket.OPEN)
        client.send(JSON.stringify(message));
  }

  @SubscribeMessage('game')
    async handleGame(@ConnectedSocket() client: WebSocket, @MessageBody() payload: any) : Promise<void> // create a GamePayload interface to avoid 'any'?
    {
      const clientData = clientsMap.get(client); //client.data.user.sub;
      if (!clientData) {
        client.close();
        return;
      }
      const userId = clientData.user.sub
      
      // Dispatch "State" exemple
      switch (payload.state) {
        case 'end_map':
          await this.gameService.handleEndMap(userId, payload);
          break;
        default:
          client.send(JSON.stringify({
            event: 'game',
            state: 'action_rejected',
            data: { reason: 'invalid_action' }
          }));
      }
    }
  }
