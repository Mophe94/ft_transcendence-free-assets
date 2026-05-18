import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { WebSocket, Server } from 'ws';

interface LobbyData {
  userId : string;
  lobbyId : string;
}

@WebSocketGateway(8080, /* { cors: true } */) //enable Cross-Origin Resource Sharing (CORS). It allows a server to accept requests from web applications hosted on domains different from its own
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server : Server;
  
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

  @SubscribeMessage('joinLobby')
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
}
