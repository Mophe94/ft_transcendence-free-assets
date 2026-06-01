import {
  SubscribeMessage, WebSocketGateway,
  OnGatewayConnection, OnGatewayDisconnect,
  WebSocketServer, ConnectedSocket, MessageBody 
} from '@nestjs/websockets';
import { WebSocket, Server } from 'ws';
import { GameService } from './game.service';
import { GamePayload, PHASE_DURATIONS,  PhaseName, createMockUser} from './game.type';
import { ClientData, clientsMap } from 'src/shared/clients.map';

@WebSocketGateway(8082, /* { cors: true } */)
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server : Server;

  constructor(private gameService: GameService) {}
  
  handleConnection(client: WebSocket): void {
    //client.data.user = createMockUser();
   clientsMap.set(client, { user: createMockUser() });
    console.log('Client connected');
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
      const username = clientData.user.username;
      
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
