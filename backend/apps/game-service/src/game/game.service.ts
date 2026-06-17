import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PlayerService } from './player/player.service';
import { GamePayload } from './game.type';
import { clientsMap } from 'apps/game-service/src/shared/clients.map';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { FULL_LOBBY, PHASE_DURATIONS } from 'apps/game-service/src/game/game.type';
import { start_game } from './events/start_game';


@Injectable()
export class GameService implements OnModuleInit {

  constructor(private roomService: RoomService,
    private eventEmitter: EventEmitter2,
    private phaseTimer: PhaseTimerService,
    private playerService: PlayerService) {}

  private rooms = new Map<string, Set<WebSocket>>();

  // TEST with hardcoded values
  onModuleInit(): void {
    this.registerRoom('test-room', [1, 2, 3, 4, 5, 6, 7, 8]);
  }
  // roomIds + authorized users -> next Redis
  private readonly autorizedPlayers = new Map<string, Set<number>>();
  registerRoom(roomId: string, userIds: number[]): void {
    this.autorizedPlayers.set(roomId, new Set(userIds));
  }

  isPlayerInRoom(userId: number, roomId: string): boolean {
    return this.autorizedPlayers.get(roomId)?.has(userId) ?? false;
  }

  onGodotConnected(client: WebSocket, userId: number, roomId: string) : object | null {
    this.roomService.joinRoom(client, roomId);
    const size = this.roomService.getRoomSize(roomId);
    console.log(`Size = ${size}, RoomId = ${roomId}`);

    if (!this.playerService.getPlayer(userId)) {
      this.playerService.initPlayer(userId);
    }

    if (size === FULL_LOBBY) {
      return this.startMapPhase(userId, roomId);
      console.log('[GameService]: StartMapPhase');
    }
    return null;
  }

  startMapPhase(userId: number, roomId: string): object {
    this.phaseTimer.start(roomId, 'map', () => {
      console.log(`Room ${roomId} map phase timeout`);
    });

    const player = this.playerService.getPlayer(userId)!;
    player.timer = PHASE_DURATIONS.map;
    //add server_time ?
    const payload = start_game(player);
    console.log(`[GameService]: startMapPhase -> start_game payload built`)
    return payload;

  }

  //Events 
  @OnEvent('lobby.start')
  initGameRoom({ roomId }: { roomId: string }) : void {
    console.log("OnEvent -> createRoom()")
    this.roomService.createRoom(roomId);
  }

/*   async handleEndMap(userId: number, payload: any): Promise<void> {
    console.log('[GameService]: handleEndMap called');
    // load data from DB and return a Json to broadcast
  } */
}
