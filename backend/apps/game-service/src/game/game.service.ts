import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { GamePayload } from './game.type';
import { clientsMap } from 'apps/game-service/src/shared/clients.map';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { FULL_LOBBY, PHASE_DURATIONS } from 'apps/game-service/src/game/game.type';


@Injectable()
export class GameService implements OnModuleInit {

  constructor(private roomService: RoomService,
    private eventEmitter: EventEmitter2,
    private phaseTimer: PhaseTimerService) {}

  private rooms = new Map<string, Set<WebSocket>>();

  // TEST with hardcoded values
  onModuleInit(): void {
    this.registerRoom('test-room', [1, 2, 3, 4, 5, 6, 7, 8]);
  }
  // roomIds + authorized users -> next Redis
  private autorizedPlayers = new Map<string, Set<number>>();
  registerRoom(roomId: string, userIds: number[]): void {
    this.autorizedPlayers.set(roomId, new Set(userIds));
  }

  isPlayerInRoom(userId: number, roomId: string): boolean {
    return this.autorizedPlayers.get(roomId)?.has(userId) ?? false;
  }

  @OnEvent('lobby.start')
  initGameRoom({ roomId }: { roomId: string }) : void {
    this.roomService.createRoom(roomId);
  }

  onGodotConnected(client: WebSocket, roomId: string) : void {
    this.roomService.joinRoom(client, roomId);
    const size = this.roomService.getRoomSize(roomId);
    if (size === FULL_LOBBY) {
      this.startMapPhase(roomId);
      console.log('FULL');
    }
  }

  startMapPhase(roomId: string): void {
    this.phaseTimer.start(roomId, 'map', () => {
      console.log(`Room ${roomId} map phase timeout`);
    });
  }

  async handleEndMap(userId: number, payload: any): Promise<void> {
    console.log('[GameService]: handleEndMap called');
    // load data from DB and return a Json to broadcast
  }
}
