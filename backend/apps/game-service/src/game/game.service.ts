import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PlayerService } from './player/player.service';
import { MonstersService } from './entities/monsters.service';
import { TilesService } from './entities/tiles.service';
import { ItemsService } from './entities/items.service';
import { Player } from './player/player';
import { CombatService } from './combat.service';
import { GamePayload } from './game.type';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { FULL, PHASE_DURATIONS } from 'apps/game-service/src/game/game.type';
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
    private combatService: CombatService,
    private monstersService: MonstersService,
    private tilesService: TilesService,
    private itemsService: ItemsService,
  ) {}

  private gameRooms = new Map<string, Set<number>>();

  private joinGameRoom(roomId: string, userId: number): Set<number> {
    let room = this.gameRooms.get(roomId);
    if (!room) {
      room = new Set();
      this.gameRooms.set(roomId, room);
    }
    room.add(userId);
    return room;
  }

  private leaveGameRoom(roomId: string, userId: number): void {
    const room = this.gameRooms.get(roomId);
    if (!room) return;
    room.delete(userId);
    if (room.size === 0) this.gameRooms.delete(roomId);
  }

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
  ): Promise<void> {
    const room = this.joinGameRoom(roomId, userId);
    console.log(`Size = ${room.size}, RoomId = ${roomId}`);

    if (!this.playerService.getPlayer(userId)) {
      this.playerService.initPlayer(userId);
    }

    if (room.size === FULL) {
      this.combatService.matchmake(room);
      // TEST MATCHMAKING //
      for (const userId of room) {
        const player = this.playerService.getPlayer(userId)!;
        const opponentId = this.combatService.getOpponentId(userId);
        const enemy = opponentId
          ? this.playerService.getPlayer(opponentId)
          : undefined;
        if (!enemy) {
          console.log(
            `[GameService]: No opponent for ${userId} (room ${roomId}) - using player as placeholder`,
          );
        }
        console.log('USER ID: ', userId);
        console.log('OPONNENT ID: ', opponentId);
        console.log('******************');
      }

      await this.startMapPhase(roomId, room);
    }
  }

  onGodotDisconnected(userId: number, roomId: string): void {
    this.leaveGameRoom(roomId, userId);
  }

  private sendToPlayer(userId: number, payload: object): void {
    console.log(`Send_to_player: ${userId} -> ${payload}`);
    this.eventEmitter.emit('send_to_player', { userId, payload });
  }

  private async startMapPhase(
    roomId: string,
    room: Set<number>,
  ): Promise<void> {
    this.phaseTimer.start(`game: ${roomId}`, 'map', () => {
      console.log(`Room ${roomId} map phase timeout`);
      this.startTeamSetupPhase(roomId, room);
    });

    const mapTimer =
      this.phaseTimer.startTimes.get(`game: ${roomId}`)! + PHASE_DURATIONS.map;

    const payloads = await Promise.all(
      [...room].map(async (userId) => {
        const player = this.playerService.getPlayer(userId)!;
        player.timer = mapTimer;
        return { userId, payload: await this.start_game(player) };
      }),
    );

    payloads.forEach(({ userId, payload }) => {
      this.sendToPlayer(userId, payload);
    });

    console.log(
      `[GameService]: startMapPhase -> start_game sent to ${room.size} players of ${roomId}`,
    );
  }

  private startTeamSetupPhase(roomId: string, room: Set<number>) {
    this.phaseTimer.start(`game: ${roomId}`, 'team_setup', () => {
      console.log(`Room ${roomId} team_setup phase timeout`);
      this.startCombatPhase(roomId, room);
    });
    const teamSetupTimer =
      this.phaseTimer.startTimes.get(`game: ${roomId}`)! +
      PHASE_DURATIONS.team_setup;

    for (const userId of room) {
      const player = this.playerService.getPlayer(userId)!;
      player.timer = teamSetupTimer;

      const opponentId = this.combatService.getOpponentId(userId);
      const enemy = opponentId
        ? this.playerService.getPlayer(opponentId)
        : undefined;
      if (!enemy) {
        console.log(
          `[GameService]: No opponent for ${userId} (room ${roomId}) - using player as placeholder`,
        );
      }

      // TEST MATCHMAKING //
      console.log(
        'USER ID: ',
        userId /* ': ', this.team_setup(player, enemy ?? player) */,
      );
      console.log('OPONNENT ID: ', opponentId);
      console.log('******************');
      //******************************//

      this.sendToPlayer(userId, this.team_setup(player, enemy ?? player));
    }
  }

  private startCombatPhase(roomId: string, room: Set<number>) {
    this.phaseTimer.start(`game: ${roomId}`, 'choose_monster', () => {
      console.log(`Room ${roomId} choose_monster timeout`);
    });

    const combatTimer =
      this.phaseTimer.startTimes.get(`game: ${roomId}`)! +
      PHASE_DURATIONS.choose_monster;

    for (const userId of room) {
      const player = this.playerService.getPlayer(userId)!;
      player.timer = combatTimer;
    }

    console.log('Combat timer started');
  }

  async handleMessage(
    userId: number,
    payload: any,
  ): Promise<object | undefined> {
    const player = this.playerService.getPlayer(userId)!;
    let result: object | undefined;
    switch (payload.state) {
      case 'add_item':
        result = await this.received_add_item(player);
        break;
      case 'delete_item':
        result = await this.received_delete_item(player, payload.item);
        break;
      case 'item_request':
        result = await this.received_request_item(player);
        break;
      case 'use_item':
        result = await this.received_use_item(player, payload.item);
        break;
      case 'new_encounter': {
        result = await this.received_new_encounter(player, payload.tile);
        break;
      }
      case 'try_catch':
        result = await this.received_try_catch(player);
        break;
      case 'delete_monster':
        result = await this.received_delete_monster(player, payload.monster);
        break;
      case 'team_choice': {
        result = await this.received_team_choice(player, payload.battle_team);
        break;
      }
      /*       case "change_current_monster":
        result = await this.received_update_current_monster(player, payload.data.slot); break;
      case "use_item_combat":
        result = await this.received_use_item_combat(player, enemy, payload.data.item); break;
      case "try_attack":
        result = await this.received_try_attack(player, enemy, payload.data.skill); break; */
      default:
        return {
          event: 'game',
          data: { state: payload.state, reason: 'invalid_action' },
        };
    }
    if (!result) console.log('[GAME-SERVICE]: UNDEFINED RESULT PAYLOAD');
    //console.log('Result payload: ', result);
    return result;
  }

  // HANDLERS

  // RECEIVED REQUEST FOR MONSTER IN THIS TILE, CALL DB GAME + CHOICE ONE RANDOM MONSTER BASED ON THERE RARITY VALUE AND RETURN THIS
  private async received_new_encounter(player: Player, tile: string) {
    const table_encounter = {
      commun: 60,
      uncommun: 30,
      rare: 10,
    };
    // Retrieve list monsters by tile
    const tileObject = await this.tilesService.findOneByType(tile);
    if (!tileObject) {
      console.log('tileObject is undefined');
      return undefined;
    }
    const tileId = tileObject.id;

    let table_monster = await this.monstersService.findMonstersByTile(tileId);
    if (!table_monster) {
      console.log('table_monster is undefined');
      return undefined;
    }
    console.log('Monster list by tiles: ', table_monster);

    let result = Math.floor(Math.random() * 100);
    // call monster from db
    if (result <= table_encounter.rare) {
      result = Math.floor(Math.random() * 100);
      let gap = Math.floor(100 / table_monster.length);
      let step = gap;
      let i = 0;
      for (i; result > gap && i < table_monster.length - 1; ++i) gap += step;
      player.current_monster = table_monster[i].name;
      player.current_monster_rarity = 'rare';
    } else if (result <= table_encounter.uncommun) {
      /* && monster.rarity === uncommun exist*/
      result = Math.floor(Math.random() * 100);
      let gap = Math.floor(100 / table_monster.length);
      let step = gap;
      let i = 0;
      for (i; result > gap && i < table_monster.length - 1; ++i) gap += step;
      player.current_monster = table_monster[i].name;
      player.current_monster_rarity = 'uncommon';
    } else {
      result = Math.floor(Math.random() * 100);
      // remplir table monster avec les nom des pq en commun
      let gap = Math.floor(100 / table_monster.length);
      let step = gap;
      let i = 0;
      for (i; result > gap && i < table_monster.length - 1; ++i) gap += step;
      player.current_monster = table_monster[i].name;
      player.current_monster_rarity = 'common';
    }

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

  // CHECK MATCH OF MONSTER WITH RANDOM VALUE AND RETURN TRUE IF OK OR FALSE
  private received_try_catch(player: Player, item?: string) {
    const table_encounter = {
      common: 70,
      uncommon: 50,
      rare: 20,
    };
    let result: number = 0;

    if (item !== undefined) result = Math.floor(Math.random() * 101);

    let monsterCatch: number = 0;
    console.log('Monster Rarity:', player.current_monster_rarity);
    monsterCatch =
      table_encounter[
        player.current_monster_rarity as keyof typeof table_encounter
      ];
    if (monsterCatch !== undefined) {
      if (result <= monsterCatch) {
        for (let i = 0; i < player.team.length; ++i) {
          if (player.team[i] === '') {
            player.team[i] = player.current_monster;
            return this.result_catch(player, 1);
          }
        }
      } else return this.result_catch(player, 0);
    } else return this.result_catch(player, 0);
  }

  // CHECK TEAM SENDED AND IF IT'S EMPTY, ELSE AUTO FULLY BATTLE_TEAM IF IT'S POSSIBLE
  // WHEN BATTLE_TEAM OK CALL DB GAME AND RETURN COMBAT
  private async received_team_choice(
    player: Player,
    monsters: string[],
  ): Promise<object | undefined> {
    const monstersToLoad: { name: string; slot: number }[] = []; //arr objects
    let count = 0;

    for (let i = 0; i < monsters.length; i++) {
      if (monsters[i] !== '') {
        count++;
      }
    }

    if (count === 0) {
      for (let i = 0; i < player.team.length && count <= 2; i++) {
        if (player.team[i] !== '') {
          monstersToLoad.push({
            name: player.team[i],
            slot: count,
          });
          count++;
        }
      }
    } else {
      for (let i = 0; i < monsters.length && monstersToLoad.length < 3; i++) {
        for (let j = 0; j < player.team.length; j++) {
          if (monsters[i] !== '' && monsters[i] === player.team[j]) {
            monstersToLoad.push({
              name: player.team[j],
              slot: monstersToLoad.length,
            });
            break;
          }
        }
      }
    }

    for (const { name, slot } of monstersToLoad) {
      const monster = await this.monstersService.findOneByName(name, {
        skills: true,
      });
      if (!monster)
        return {
          event: 'game',
          data: {
            state: 'team_choice',
            reason: 'invalid_monster',
            monster: name,
          },
        };
      player.battle_team[slot] = {
        name: monster.name,
        slot: slot,
        life: {
          current: monster.hp_total,
          max: monster.hp_total,
        },
        type: String(monster.type),
        attack: monster.attack,
        attack_spe: monster.attack_spe,
        defense: monster.defense,
        defense_spe: monster.defense_spe,
        speed: monster.speed,
        status: [],
        dodge: false, // missing in DB
        skill: monster.skills.slice(0, 4).map(
          (skill): PlayerSkill => ({
            name: skill.name,
            current: skill.power_point,
            max: skill.power_point,
            type: skill.type,
            effect: skill.effect,
            repetition: skill.repetition,
            precision: skill.precision,
            data: skill.data,
            value: skill.value,
          }),
        ),
      };
    }
    await new Promise((resolve) => setTimeout(resolve, 500)); // ! temp fix to synchronizeke with startCombatTimer
    return this.combat(player);
  }

  // RECEIVED REQUEST FOR ITEM, CALL DB GAME + CHOICE ONE RANDOM ITEM AND RETURN THIS
  private async received_request_item(player: Player) {
    let items = await this.itemsService.findAll();
    if (!items) {
      console.log('[ERROR]: items is undefined');
      return undefined;
    }

    let result = Math.floor(Math.random() * 100);
    let gap = Math.floor(100 / items.length);
    let step = gap;
    let i = 0;
    for (i; result > gap && i < items.length - 1; ++i) gap += step;
    player.current_item = items[i].name;
    let add = false;
    for (let i = 0; i < player.inventory.length; ++i) {
      if (player.inventory[i]['name'] === player.current_item) {
        player.inventory[i]['current'] += 1;
        add = true;
      }
    }
    if (add === false) {
      for (let i = 0; i < player.inventory.length; i++) {
        if (player.inventory[i]['name'] === '') {
          player.inventory[i]['name'] = player.current_item;
          player.inventory[i]['scene'] = items[i].scene;
          player.inventory[i]['current'] += 1;
          player.inventory[i]['value'] = items[i].value;
          player.inventory[i]['target'] = items[i].target;
          break;
        }
      }
    }
    return this.new_current_item(player);
  }

  // ADD ITEM + RETURN UPDATE_ITEM
  private received_add_item(player: Player) {
    player.current_item = '';
    return this.update_inventory(player);
  }

  // CALL REMOVE ITEM + ADD MONSTER IN TEAM + SEND RESULT_CATCH WITH UPDATE_TEAM
  private received_use_item(player: Player, item: string) {
    const userId = this.playerService.getUserId(player);
    if (!userId) return undefined;
    this.sendToPlayer(userId, this.received_delete_item(player, item));

    for (let i = 0; i < player.team.length; ++i) {
      if (player.team[i] === '') {
        player.team[i] = player.current_monster;
        break;
      }
    }
    return this.result_catch(player, 1);
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

  private result_catch(player: Player, result: number, monsterFlee?: number) {
    let success: number = 0;
    let msg = {
      event: 'game',
      data: {
        state: 'result_catch',
        success: '',
        player: {
          team: result !== 0 ? player.team : undefined,
        },
      },
    };

    if (result == 1) {
      msg.data.success = 'ok';
      return msg;
    } else {
      let flee = Math.floor(Math.random() * 101);
      if (flee < 50) msg.data.success = 'flee';
      else msg.data.success = 'fail';
      return msg;
    }
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

  // // DELETE ITEM + SEND UPDATE_ITEM
  private received_delete_item(player: Player, item: string) {
    for (let i = 0; i < player.inventory.length; ++i) {
      if (player.inventory[i]['name'] === item) {
        if (player.inventory[i].current === 1) {
          player.inventory[i]['name'] = '';
          player.inventory[i]['scene'] = '';
          player.inventory[i]['type'] = '';
          player.inventory[i]['target'] = '';
          player.inventory[i]['value'] = 0;
          player.inventory[i]['current'] = 0;
        } else player.inventory[i].current -= 1;
      }
      break;
    }
    return this.update_inventory(player);
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

  /*   //Events
  @OnEvent('lobby.start')
  initGameRoom({ roomId }: { roomId: string }): void {
    console.log('OnEvent -> createRoom()');
    this.roomService.createRoom(roomId);
  } */
}
