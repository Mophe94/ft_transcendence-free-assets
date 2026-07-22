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
import { max } from 'node_modules/class-validator/types';
import { MonsterType } from './entities/types/monster_type.enum';
import { Skill } from './entities/skills.entity';
import {
  CurrentMonster,
  Skill as PlayerSkill,
} from './player/player.interfaces';

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
    const player = this.playerService.getPlayer(userId)!;
    this.phaseTimer.start(roomId, 'map', () => {
      console.log(`Room ${roomId} map phase timeout`);
      this.phaseTimer.start(roomId, 'team_setup', () => {
        console.log(`Room ${roomId} team_setup phase timeout`);
      });
      player.timer =
        this.phaseTimer.startTimes.get(roomId)! + PHASE_DURATIONS.team_setup;
      this.eventEmitter.emit('team_setup', {
        userId: userId,
        payload: this.team_setup(player, player),
      }); //Player A
      //this.eventEmitter.emit('team_setup', {userId: userId, paylod: this.team_setup(player, player)}); //Player B
      console.log(payload);
    });

    player.timer =
      this.phaseTimer.startTimes.get(roomId)! + PHASE_DURATIONS.map;
    const payload = await this.start_game(player);
    console.log(`[GameService]: startMapPhase -> start_game payload built`);
    console.log(payload);
    return payload;
  }

  async handleMessage(
    userId: number,
    payload: any,
  ): Promise<object | undefined> {
    const player = this.playerService.getPlayer(userId)!;
    switch (payload.state) {
      /*       case "add_item":
        return this.received_add_item(player)
      case "delete_item":
        return this.received_delete_item(player, payload.data.item)
      case "item_request":
        return this.received_request_item(player)
      case "use_item":
        return this.received_use_item(player, payload.data.item) */
      case 'new_encounter':
        return this.received_new_encounter(player, 2 /* payload.data.tile */);
      case 'try_catch':
        return this.received_try_catch(player);
      case 'delete_monster':
        return this.received_delete_monster(player, payload.monster);
      case 'team_choice': {
        console.log(`Payload team_choice: ${payload.battle_team}`);
        return this.received_team_choice(player, payload.battle_team);
      }
      /*       case "change_current_monster":
        return this.received_update_current_monster(player, payload.data.slot)
      case "use_item_combat":
        return this.received_use_item_combat(player, enemy, payload.data.item)
      case "try_attack":
        return this.received_try_attack(player, enemy, payload.data.skill) */
      default:
        return {
          event: 'game',
          data: { state: payload.state, reason: 'invalid_action' },
        };
    }
  }

  private async initMonster(
    player: Player,
    monsterId: number,
  ): Promise<CurrentMonster | undefined> {
    const monster = await this.monstersService.findOneById(
      monsterId /* , { skills: true } */,
    );
    console.log('monster from DB:', monster);
    if (!monster) return undefined;
    const currentMonster: CurrentMonster = {
      name: monster.name,
      type: String(monster.type), //add enum
      slot: 0,
      life: {
        current: monster.hp_total,
        max: monster.hp_total,
      },
      status: [],
      skill: [], // 4 slots
    };

    player.currentMonster = currentMonster;
    console.log(monster);
    return currentMonster;
  }

  // HANDLERS
  // RECEIVED REQUEST FOR MONSTER IN THIS TILE, CALL DB GAME + CHOICE ONE RANDOM MONSTER BASED ON THERE RARITY VALUE AND RETURN THIS
  private async received_new_encounter(
    player: Player,
    tile: number,
  ): Promise<object | undefined> {
    const monsters = await this.monstersService.findMonstersByTile(tile);
    player.current_monster = monsters[1].name; //
    console.log(`Monsters by tile: ${monsters[1]}`);
    return this.new_encounter(player);
  }

  private received_delete_monster(player: Player, monster: string) {
    for (let i = 0; i < player.team.length; ++i) {
      if (player.team[i] === monster) {
        player.team[i] = '';
        break;
      }
    }
    return this.update_team(player);
  }

  private received_try_catch(player: Player) {
    let result = Math.floor(Math.random() * 101);

    if (result <= player.current_monster_catch /* rarity now? */) {
      for (let i = 0; i < player.team.length; ++i) {
        if (player.team[i] === '') {
          player.team[i] = player.current_monster;
          break;
        }
      }
      return this.result_catch(player, 1);
    } else return this.result_catch(player, 0);
  }

  // CHECK TEAM SENDED AND IF IT'S EMPTY, ELSE AUTO FULLY BATTLE_TEAM IF IT'S POSSIBLE
  // WHEN BATTLE_TEAM OK CALL DB GAME AND RETURN COMBAT
  private async received_team_choice(player: Player, monsters: string[]) : Promise<object | undefined> {
    //retrieve monsters stat from db
    for (let i = 0; i < monsters.length; ++i) {
      if (monsters[i] != "") {
        const monster = await this.monstersService.findOneByName(monsters[i]);
        if (!monster) return undefined;
        console.log(monster);
        const currentMonster: CurrentMonster = {
          name: monster.name,
          type: String(monster.type), //add enum
          slot: i,
          life: {
            current: monster.hp_total,
            max: monster.hp_total,
          },
          status: [],
          skill: [], // 4 slots
        };
    
        player.battle_team[i] = currentMonster;
        
      }
    }

    let count: number = 0;
    for (let i = 0; i < monsters.length; ++i) {
      if (monsters[i] !== '') count++;
    }
    if (count === 0) {
      for (let i = 0; i < player.team.length; ++i) {
        if (player.team[i] !== '') {
          player.battle_team[count]['name'] = player.team[i];
          player.battle_team[count]['slot'] = count;
          ++count;
        }
        if (count === 3) break;
      }
    } else {
      for (let i = 0; i < player.battle_team.length; ++i) {
        player.battle_team[i]['name'] === monsters[i];
        player.battle_team[count]['slot'] = i;
      }
    }

    return this.combat(player);
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
    //const monster = await this.initMonster(player, 2/* payload.data.monsterId */);
    return {
      event: 'game',
      data: {
        state: 'start_game',
        player: {
          id: player.id,
          name: 'Ce que tu veux',
          asset: 'dinoBlue',
          team: player.team,
          //monster: player.currentMonster.name,
        },
        timer: player.timer,
        current_map: 'map_01',
      },
    };
  }

  private new_encounter(player: Player) {
    return {
      event: 'game',
      data: {
        state: 'new_encounter',
        current_monster: player.current_monster,
      },
    };
  }

  private result_catch(player: Player, result: number) {
    return {
      event: 'game',
      data: {
        state: 'result_catch',
        success: result !== 0 ? 'ok' : 'fail',
        player: {
          team: result !== 0 ? player.team : undefined,
        },
      },
    };
  }

  private update_inventory(player: Player) {
    return {
      event: 'game',
      data: {
        state: 'update_inventory',
        player: {
          inventory: player.inventory,
        },
      },
    };
  }

  private new_current_item(player: Player) {
    return {
      event: 'game',
      data: {
        state: 'new_current_item',
        current_item: player.current_item,
      },
    };
  }

  private update_team(player: Player) {
    return {
      event: 'game',
      data: {
        state: 'update_team',
        player: {
          team: player.team,
        },
      },
    };
  }

  private team_setup(player: Player, enemy: Player) {
    return {
      event: 'game',
      data: {
        state: 'team_setup',
        timer: player.timer,
        player: {
          team: player.team,
        },
        enemy: {
          id: enemy.id,
          name: enemy.name,
          asset: enemy.asset,
          team: enemy.team,
        },
      },
    };
  }

  private combat(player: Player) {
    return {
      event: 'game',
      data: {
        state: 'combat',
        timer: player.timer,
        player: {
          battle_team: player.battle_team,
        },
      },
    };
  }

  changeMonster: (new_monster: number) => object;
  attack: (enemy: Player, attackName: string) => object;

  //Events
  @OnEvent('lobby.start')
  initGameRoom({ roomId }: { roomId: string }): void {
    console.log('OnEvent -> createRoom()');
    this.roomService.createRoom(roomId);
  }
}
