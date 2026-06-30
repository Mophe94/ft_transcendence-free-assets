import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PlayerService } from './player/player.service';
import { MonstersService } from './entities/monsters.service';
import { Player } from './player/player';
import { GamePayload } from './game.type';
import { clientsMap } from 'apps/game-service/src/shared/clients.map';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import {
  FULL_LOBBY,
  PHASE_DURATIONS,
} from 'apps/game-service/src/game/game.type';
import { start_game } from './events/start_game';
import { new_encounter } from './events/new_encounters';
import { max } from 'node_modules/class-validator/types';
import { MonsterType } from './entities/types/monster_type.enum';
import { Skill } from './entities/skills.entity';
import { CurrentMonster, Skill as PlayerSkill} from './player/player.interfaces';

@Injectable()
export class GameService implements OnModuleInit {
  constructor(
    private roomService: RoomService,
    private eventEmitter: EventEmitter2,
    private phaseTimer: PhaseTimerService,
    private playerService: PlayerService,
    private monstersService: MonstersService,
  ) {}

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

  async onGodotConnected(
    client: WebSocket,
    userId: number,
    roomId: string,
  ): Promise<object | null> {
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

  async startMapPhase(userId: number, roomId: string): Promise<object> {
    this.phaseTimer.start(roomId, 'map', () => {
      console.log(`Room ${roomId} map phase timeout`);
    });

    const player = this.playerService.getPlayer(userId)!;
    player.timer = this.phaseTimer.startTimes.get(roomId)! + PHASE_DURATIONS.map; // server time + map time in millisec-> make it cleaner
    const payload = await this.start_game(player);
    console.log(`[GameService]: startMapPhase -> start_game payload built`);
    console.log(payload);
    return payload;
  }

  async handleMessage(userId: number, payload: GamePayload): Promise<object> {
    const player = this.playerService.getPlayer(userId)!;
    switch (payload.state) {
      case 'new_encounter':
        return this.handleNewEncounter(player, payload.data.tile);
      default:
        return {
          event: 'game',
          data: { state: 'action_rejected', reason: 'invalid_action' },
        };
    }
  }

  private async initMonster(player: Player, monsterId: number): Promise<CurrentMonster | null> {
    const monster = await this.monstersService.findOneById(monsterId/* , { skills: true } */);
    console.log('monster from DB:', monster);
    if (!monster)
      return null;
    const currentMonster: CurrentMonster = {
      name: monster.name,
      type: String(monster.type), //add enum
      slot: 0,
      life: {
        current: monster.hp_total,
        max : monster.hp_total,
      },
      status: [],
      skill: [], // 4 slots
    };
    
    player.currentMonster = currentMonster;
    console.log(monster);
    return currentMonster;
  }

  private handleNewEncounter(player: Player, tile: string): object {
    //retrieve in DB
    player.current_monster = 'monster_test';
    //this.monstersService.findOneByName()

    return new_encounter(player);
  }

  // JSON RESPONSE

  async start_game(player: Player) {
    // return {
    //   event: 'game',
    //   data: {
    //     state: 'start_game',
    //     player: {
    //       id: player.id,
    //       name: player.name,
    //       asset: player.asset,
    //       team: player.team,
    //     },
    //     timer: player.timer,
    //     current_map: player.current_map,
    //   },
    // };
    const monster = await this.initMonster(player, 1/* payload.data.monsterId */);
    return {
      event: 'game',
      data: {
        state: 'start_game',
        player: {
          id: player.id,
          name: 'Ce que tu veux',
          asset: 'dinoBlue',
          team: player.team,
          monster: player.currentMonster.name,
  
        },
        timer: player.timer,
        current_map: 'map_01',
      },
    };
  }

  new_current_item: () => object;
  new_encounter: () => object;
  result_catch: (result: number) => object;
  start_map: () => object;
  team_setup: (enemy: Player) => object;
  update_inventory: () => object;
  update_team: () => object;

  combat: () => object;

  changeMonster: (new_monster: number) => object;
  attack: (enemy: Player, attackName: string) => object;

  //Events
  @OnEvent('lobby.start')
  initGameRoom({ roomId }: { roomId: string }): void {
    console.log('OnEvent -> createRoom()');
    this.roomService.createRoom(roomId);
  }
}
