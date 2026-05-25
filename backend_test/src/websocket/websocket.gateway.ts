import { Controller } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { WebSocket, Server } from 'ws';

import { GameService } from 'src/game/game.service';

interface LobbyData {
  userId : string;
  lobbyId : string;
}

/* interface GamePayload {
  state : string;
  data : any;
} */

@WebSocketGateway(8080, /* { cors: true } */)
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server : Server;

  constructor(private gameService: GameService) {}
  
  handleConnection(client: WebSocket, ...args: any[]): any {
    console.log('Connected');
  }

  handleDisconnect(client: WebSocket): any {
    console.log('Disonnected');
  }

  private rooms = new Map<string, Set<WebSocket>>();

  private broadcast(clients : Set<WebSocket>, message : string) {
    clients.forEach((client) => {
      client.send(message);
    })
  }

  @SubscribeMessage('lobby')
  handlejoinLobby(client: WebSocket, payload: LobbyData): string {
    if (!this.rooms.has(payload.lobbyId))
      this.rooms.set(payload.lobbyId, new Set([client]));
    else
      this.rooms.get(payload.lobbyId)?.add(client);
    
    const clients = this.rooms.get(payload.lobbyId);
    if (clients)
      this.broadcast(clients, `{"scene" : "lobby", "type" : "join", "userId" : ${payload.lobbyId}}`)

    console.log(`Client joined lobby: ${payload.lobbyId}`);

    return '🦭';
  }

  @SubscribeMessage('game')
  async handleGame(@ConnectedSocket() client: WebSocket, @MessageBody() payload: any) : Promise<void> // create a GamePayload interface to avoid 'any'?
  {
    const userId = client['userId']; //see with auth
    
    // Dispatch "State" exemple
    switch (payload.state) {
      case 'end_map':
        await this.gameService.handleEndMap(userId, payload);
        break;
      default:
        client.send(JSON.stringify({
          event: 'game',
          state: 'action_rejected',
          data: { reason: 'invalid_action' },
        }))

      return 
    }
  }

}
