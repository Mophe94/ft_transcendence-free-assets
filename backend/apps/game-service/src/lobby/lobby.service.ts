import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebSocket } from 'ws';
import { randomUUID } from 'crypto';
import { clientsMap, ClientData } from 'apps/game-service/src/shared/clients.map';
import { FULL_LOBBY } from 'apps/game-service/src/game/game.type';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RoomService } from 'apps/game-service/src/shared/room.service'

@Injectable()
export class LobbyService {
  constructor(
    private roomService: RoomService,
    private eventEmitter: EventEmitter2,
    private phaseTimer: PhaseTimerService,
  ) {}

  private rooms = new Map<string, Set<WebSocket>>();

  // JOIN LOBBY
  joinLobby(client: WebSocket, user: ClientData['user']): void {

    const roomId = this.roomService.findAvailableRoom() ?? this.roomService.createRoom();

    this.roomService.joinRoom(client, roomId);

    const clients = this.roomService.getClients(roomId)!;

/*     const clientData = clientsMap.get(client);
    if (clientData) clientData.roomId = roomId; */

    console.log(`[LobbyService] User ${user.sub} joined room ${roomId} (${clients.size}/${FULL_LOBBY})`);

    this.eventEmitter.emit('lobby.player_joined', {
      clients,
      roomId,
      playerCount: clients.size,
    });

    if (clients.size === FULL_LOBBY) {
      this.phaseTimer.clear(roomId);
      this.eventEmitter.emit('lobby.start', { roomId, clients });
    } else if (clients.size === 1) {
      this.phaseTimer.start(roomId, 'lobby', () => {
        console.log(`[LobbyService] Room ${roomId} lobby timeout`);
        //ADD bots ??
        this.eventEmitter.emit('lobby.start', { roomId, clients });
      });
    }
  }

}
