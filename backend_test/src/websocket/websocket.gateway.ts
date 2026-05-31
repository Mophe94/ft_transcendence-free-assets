import {
  SubscribeMessage, WebSocketGateway,
  OnGatewayConnection, OnGatewayDisconnect,
  WebSocketServer, ConnectedSocket, MessageBody 
} from '@nestjs/websockets';
import { WebSocket, Server } from 'ws';
import { randomUUID } from 'crypto';

import { GameService } from 'src/game/game.service';

interface GamePayload {
  state : string;
  data? : any;
}

const FULL_LOBBY = 8;

const PHASE_DURATIONS = {
  lobby: 5,
  map: 200, 
  team_setup: 60, 
  choose_monster: 30,
  choose_action: 30
}

type PhaseName = keyof typeof PHASE_DURATIONS;

// DELETE when Guard is implemented
let mockUserCounter = 0;
const createMockUser = () => {
  mockUserCounter++;
  return {
    sub: mockUserCounter,
    username: `user_${mockUserCounter}`
  }
}

export interface ClientData {
  user: {
    sub: number;
    username: string;
  }
  roomId?: string;
}

export const clientsMap = new Map<WebSocket, ClientData>();


@WebSocketGateway(8080, /* { cors: true } */)
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server : Server;


  constructor(private gameService: GameService) {}

  private rooms = new Map<string, Set<WebSocket>>();

  private phaseTimers = new Map<string, NodeJS.Timeout>()
  
  handleConnection(client: WebSocket): void {
    //client.data.user = createMockUser();
   clientsMap.set(client, { user: createMockUser() });
    console.log('Client connected');
  }

  handleDisconnect(client: WebSocket): void {
    const clientData = clientsMap.get(client);
    if (clientData?.roomId)
        this.leaveRoom(client, clientData.roomId)
    clientsMap.delete(client);
    console.log('Client disonnected');
  }

  private startPhaseTimer(roomId: string, phase: PhaseName, onTimeout: () => void) : void {
    this.clearPhaseTimer(roomId);
    const duration = PHASE_DURATIONS[phase];
    this.phaseTimers.set(roomId, setTimeout(onTimeout, duration * 1000));
  }

  private clearPhaseTimer(roomId: string): void {
    const handle = this.phaseTimers.get(roomId);
    if (handle) {
      clearTimeout(handle);
      this.phaseTimers.delete(roomId);
    }
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

  // LOBBY HELPERS
  private findAvailableRoom(): string | null {
    for (const [roomId, clients] of this.rooms) {
      if (clients.size < FULL_LOBBY)
        return roomId;
    }
    return null;
  }

  private createRoom(): string {
    const roomId = randomUUID();
    this.rooms.set(roomId, new Set());
    console.log(`Room created: ${roomId}`)
    return roomId;
  }

  private leaveRoom(client: WebSocket, roomId: string): void {
    const clients = this.rooms.get(roomId);
    if (!clients)
        return
    clients.delete(client);
    console.log(`Client left ${roomId}, ${clients.size} players remaining`);

    if (clients.size === 0 ) {
      this.clearPhaseTimer(roomId);
      this.rooms.delete(roomId);
      console.log(`Room ${roomId} deleted (empty)`)
    }
  }

  // LOBBY
  @SubscribeMessage('lobby')
  handlejoinLobby(@ConnectedSocket() client: WebSocket): void {
    const clientData = clientsMap.get(client);
    if (!clientData) {
      client.close();
      return;
    }

    const roomId = this.findAvailableRoom() ?? this.createRoom();
    const clients = this.rooms.get(roomId)!;

    clients?.add(client);
    clientData.roomId = roomId;
    console.log(`User ${clientData.user.sub} joined room ${roomId} (${clients.size}/${FULL_LOBBY})`)

    this.broadcast(clients, {
        event : 'lobby',
        state : 'player_joined',
        data : { roomId, playerCount: clients.size, maxPlayers: FULL_LOBBY } //See what is needed
      });

      if (clients.size === FULL_LOBBY) {
        this.clearPhaseTimer(roomId);
        this.startGame(roomId, clients);
      }
      else if (clients.size === 1) {
        this.startPhaseTimer(roomId, 'lobby', () => {
          console.log(`Room ${roomId} lobby timeout`)
          //ADD bots ??
          this.startGame(roomId, clients);
        })
      }
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
      }
    });

    this.startPhaseTimer(roomId, 'map', () => {
      console.log(`Room ${roomId} map phase timeout`)
    })
  }

  // GAME
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
          data: { reason: 'invalid_action' },
        }))
      return 
    }
  }
}
