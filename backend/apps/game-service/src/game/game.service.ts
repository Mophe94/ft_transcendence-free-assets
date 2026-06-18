import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PlayerService } from './player/player.service';
import {MonstersService } from './entities/monsters.service'
import { Player } from './player/player'
import { GamePayload } from './game.type';
import { clientsMap } from 'apps/game-service/src/shared/clients.map';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { FULL_LOBBY, PHASE_DURATIONS } from 'apps/game-service/src/game/game.type';
import { start_game } from './events/start_game';
import { new_encounter } from './events/new_encounters';


@Injectable()
export class GameService implements OnModuleInit {

  constructor(private roomService: RoomService,
    private eventEmitter: EventEmitter2,
    private phaseTimer: PhaseTimerService,
    private playerService: PlayerService,
    private monstersService: MonstersService) {}

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
    player.timer = this.phaseTimer.startTimes.get(roomId)! + PHASE_DURATIONS.map * 1000 ; // server time + map time in millisec-> make it cleaner
    const payload = start_game(player);
    console.log(`[GameService]: startMapPhase -> start_game payload built`)
    return payload;
  }

  async handleMessage(userId: number, state: string): Promise<object> {
    switch (state) {
      case 'new_encounter':
        return this.handleNewEncounter(userId);
      default:
        return { event: 'game', data: { state: 'action_rejected', reason: 'invalid_action'} };
    }
  }

  private handleNewEncounter(userId: number): object {
    const player = this.playerService.getPlayer(userId)!;

    //retrieve in DB 
    player.current_monster = 'monster_test';
    //this.monstersService.findOneByName()

    return new_encounter(player);
  }

  // JSON RESPONSE
  new_current_item: () => object
	new_encounter: () => object
	result_catch: (result: number) => object
	start_map: () => object
	team_setup: (enemy: Player) => object
	update_inventory: () => object
	update_team: () => object

	combat: () => object

	changeMonster: (new_monster: number) => object
	attack: (enemy: Player, attackName: string) => object

  //Events 
  @OnEvent('lobby.start')
  initGameRoom({ roomId }: { roomId: string }) : void {
    console.log("OnEvent -> createRoom()")
    this.roomService.createRoom(roomId);
  }
}
