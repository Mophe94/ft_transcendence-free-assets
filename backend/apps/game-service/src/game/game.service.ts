import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PlayerService } from './player/player.service';
import { MonstersService } from './entities/monsters.service';
import { ItemsService } from './entities/items.service';
import { Player } from './player/player';
import { CombatService } from './combat.service';
import { GamePayload } from './game.type';
import { clientsMap } from 'apps/game-service/src/shared/clients.map';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { FULL, PHASE_DURATIONS } from 'apps/game-service/src/game/game.type';
import { max } from 'node_modules/class-validator/types';
import { MonsterType } from './entities/types/monster_type.enum';
import { Skill } from './entities/skills.entity';
import { AiService } from './ai_service/ai.service';
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
    private itemsService: ItemsService,
    private aiService: AiService,
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
        const enemy = opponentId ? this.playerService.getPlayer(opponentId) : undefined;
        if (!enemy) {
          console.log(`[GameService]: No opponent for ${userId} (room ${roomId}) - using player as placeholder`);
        }
        console.log('USER ID: ', userId);
        console.log('OPONNENT ID: ', opponentId);
        console.log('******************');
      }

      await this.startMapPhase(roomId, room);
    } else if (room.size === 1) {
    this.phaseTimer.start(roomId, 'godot_fill', () => {
      console.log(`[GameService] Room ${roomId} pas remplie côté Godot -> ajout de bots`);
      this.fillRoomWithBots(roomId, room);
      });
    }
  }
  
  private async fillRoomWithBots(roomId: string, room: Set<number>): Promise<void> {
  const missing = FULL - room.size;

  for (let i = 0; i < missing; i++) {
    const botId = this.aiService.generateBotId();
    const bot = this.aiService.createBotPlayer('hardcoded', botId);
    this.playerService.injectPlayer(botId, bot);
    room.add(botId);
  }

    console.log(`[GameService] Room ${roomId} complétée avec ${missing} bot(s), taille finale: ${room.size}`);

    this.combatService.matchmake(room);
    await this.startMapPhase(roomId, room);
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
    this.phaseTimer.start(roomId, 'map', () => {
      console.log(`Room ${roomId} map phase timeout`);
      this.startTeamSetupPhase(roomId, room);
    });

    const mapTimer =
      this.phaseTimer.startTimes.get(roomId)! + PHASE_DURATIONS.map;

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
    this.phaseTimer.start(roomId, 'team_setup', () => {
      console.log(`Room ${roomId} team_setup phase timeout`);
      //this.startCombatPhase(roomId, room);

    });
    const teamSetupTimer =
      this.phaseTimer.startTimes.get(roomId)! + PHASE_DURATIONS.team_setup;

    // TODO: combat room: player/enemy
    for (const userId of room) {
      const player = this.playerService.getPlayer(userId)!;
      player.timer = teamSetupTimer;

      const opponentId = this.combatService.getOpponentId(userId);
      const enemy = opponentId ? this.playerService.getPlayer(opponentId) : undefined;
      if (!enemy) {
        console.log(`[GameService]: No opponent for ${userId} (room ${roomId}) - using player as placeholder`);
      }

		// TEST MATCHMAKING //
		console.log('USER ID: ', userId, ': ', this.team_setup(player, enemy ?? player));
		console.log('OPONNENT ID: ', opponentId);
		console.log('******************');
		//******************************//

      this.sendToPlayer(userId, this.team_setup(player, enemy ?? player));
    }
  }

/*   private startCombatPhase(roomId: string, room: Set<number>) {
    this.phaseTimer.start(roomId, 'choose_monster', () => {
      console.log(`Room ${roomId} choose_monster timeout`);

    });
    const combatTimer =
      this.phaseTimer.startTimes.get(roomId)! + PHASE_DURATIONS.choose_monster;

  } */

  async handleMessage(
    userId: number,
    payload: any,
  ): Promise<object | undefined> {
    const player = this.playerService.getPlayer(userId)!;
    let result: object | undefined;
    switch (payload.state) {
            case "add_item":
        result = await this.received_add_item(player); break;
      case "delete_item":
        result = await this.received_delete_item(player, payload.item); break;
      case "item_request":
        result = await this.received_request_item(player); break;
      case "use_item":
        result = await this.received_use_item(player, payload.item); break;
      case 'new_encounter': {
        result = await this.received_new_encounter(
          player,
          2 /* payload.tile */,
        );
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
    console.log('Result payload: ', result);
    return result;
  }

  // HANDLERS

  // RECEIVED REQUEST FOR MONSTER IN THIS TILE, CALL DB GAME + CHOICE ONE RANDOM MONSTER BASED ON THERE RARITY VALUE AND RETURN THIS
  private async received_new_encounter(
    player: Player,
    tile: number,
  ): Promise<object | undefined> {
    const monsters = await this.monstersService.findMonstersByTile(tile);
    player.current_monster = monsters[1].name; //
    //console.log('Monsters by tile', monsters[1]);
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

    if (result <= 50) {
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
  private async received_team_choice(
    player: Player,
    monsters: string[],
  ): Promise<object | undefined> {
    //retrieve monsters stat from db
    for (let i = 0; i < monsters.length; ++i) {
      if (monsters[i] != '') {
        const monster = await this.monstersService.findOneByName(
          monsters[i] /* , { skills: true } */
        );
        if (!monster) return undefined;
        console.log(monster);
        const currentMonster: CurrentMonster = {
          name: monster.name,
          type: String(monster.type),
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
        if (count === 2) break;
      }
    } else {
      for (let i = 0; i < player.battle_team.length; ++i) {
        player.battle_team[i]['name'] = monsters[i];
        player.battle_team[count]['slot'] = i;
      }
    }
/*     const combatTimer =
    this.phaseTimer.startTimes.get(roomId)! + PHASE_DURATIONS.choose_monster; */
    return this.combat(player);
  }

  // RECEIVED REQUEST FOR ITEM, CALL DB GAME + CHOICE ONE RANDOM ITEM AND RETURN THIS
  private received_request_item(player: Player){
    let item = 'golden ticket';
    //demande object existant +++++ item = name of item select
    player.current_item = item
    return this.new_current_item(player);
  }

  // ADD ITEM + RETURN UPDATE_ITEM
  private received_add_item(player: Player){
    for (let i = 0; i < player.inventory.length; ++i){
      if (player.inventory[i]["name"] === ""){
        player.inventory[i]["name"] = player.current_item;
        player.inventory[i]["scene"] = 'map';
        player.inventory[i]["current"] += 1;
        //call pour scene et value et target
        break;
      }
      else if (player.inventory[i]["name"] === player.current_item){
        player.inventory[i]["current"] += 1;
        break;
      }
    }
    player.current_item = "";
    return this.update_inventory(player);
  }


  // CALL REMOVE ITEM + ADD MONSTER IN TEAM + SEND RESULT_CATCH WITH UPDATE_TEAM
  private received_use_item(player: Player, item: string){
    this.received_delete_item(player, item);

    for (let i = 0; i < player.team.length; ++i){
      if (player.team[i] === "")
      player.team[i] = player.current_monster;
      break;
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

    // // DELETE ITEM + SEND UPDATE_ITEM
  private received_delete_item(player: Player, item: string){
    for (let i = 0; i < player.inventory.length; ++i){
      if (player.inventory[i]["name"] === item){
          player.inventory[i]["name"] = "";
          player.inventory[i]["scene"] = "";
          player.inventory[i]["type"] = "";
          player.inventory[i]["target"] = "";
          player.inventory[i]["value"] = 0;
        }
        break;
      }
      console.log(this.update_inventory(player));
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
        timer: PHASE_DURATIONS.choose_monster, //player.timer,
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
