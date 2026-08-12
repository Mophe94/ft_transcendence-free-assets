import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PlayerService } from './player/player.service';
import { MonstersService } from './entities/monsters.service';
import { TilesService } from './entities/tiles.service';
import { ItemsService } from './entities/items.service';
import { MapService } from './map.service';
import { Player } from './player/player';
import { CombatService } from './combat.service';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { FULL, PHASE_DURATIONS} from 'apps/game-service/src/game/game.type';
import { RedisStateService } from '../redis/redis_state.service';

@Injectable()
export class GameService implements OnModuleInit {
  constructor(
    private roomService: RoomService,
    private eventEmitter: EventEmitter2,
    private phaseTimer: PhaseTimerService,
    private playerService: PlayerService,
    private combatService: CombatService,
    private mapService: MapService,
	private redisStateService: RedisStateService,
  ) {}
  // roomId -> usersIds
  gameRooms = new Map<string, Set<number>>();
  // userId -> roomId
  private roomIdByPlayer= new Map<number, string>();

  private joinGameRoom(roomId: string, userId: number): Set<number> {
    let rooms = this.gameRooms.get(roomId);
    if (!rooms) {
      rooms = new Set();
      this.gameRooms.set(roomId, rooms);
    }
    rooms.add(userId);
    return rooms;
  }

  private async leaveGameRoom(roomId: string, userId: number): Promise<void> {
    const room = this.gameRooms.get(roomId);
    if (!room) return;
    room.delete(userId);
    if (room.size === 0){
		this.gameRooms.delete(roomId);
	}
  }

  // TEST with hardcoded values
  onModuleInit(): void {
    this.registerRoom('test-room', [1, 2, 3, 4]);
  }
  // roomIds + authorized users -> next Redis
  private readonly authorizedPlayers = new Map<string, Set<number>>();
  private activePlayers = new Map<string, Set<number>>();


  registerRoom(roomId: string, userIds: number[]): void {
    this.authorizedPlayers.set(roomId, new Set(userIds));
    this.activePlayers.set(roomId, new Set(userIds));
  }

  isPlayerInRoom(userId: number, roomId: string): boolean {
    return this.authorizedPlayers.get(roomId)?.has(userId) ?? false;
  }

  async onGodotConnected(
    client: WebSocket,
    userId: number,
    roomId: string,
  ): Promise<void> {
    const rooms = this.joinGameRoom(roomId, userId);
    this.roomIdByPlayer.set(userId, roomId);
    console.log(`Size = ${rooms.size}, RoomId = ${roomId}`);

    if (!this.playerService.getPlayer(userId))
      this.playerService.initPlayer(userId);
    const player = this.playerService.getPlayer(userId)!;

    if (rooms.size === this.activePlayers.get(roomId)?.size) {
	  /////////////////////////////////* REDIS STATE : ADD ALL PLAYERS AND STATE */////////////////////////////////
	  for (const userId of rooms) {
		  const playerState = this.playerService.getPlayer(userId)!;
	  	await this.redisStateService.updateStatePlayer(userId.toString(), playerState);
	  }
	  /////////////////////////////////* END */////////////////////////////////
      this.combatService.matchmake(rooms);
      // TEST MATCHMAKING //
      for (const userId of rooms) {
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

      await this.startMapPhase(roomId, rooms);
    }
  }
  
  async onGodotDisconnected(userId: number, roomId: string): Promise<void> {
	/////////////////////////////////* REDIS STATE : REMOVE PLAYER */////////////////////////////////
    await this.redisStateService.removePlayer(userId.toString());
	/////////////////////////////////* END */////////////////////////////////
    this.leaveGameRoom(roomId, userId);
    this.activePlayers.get(roomId)?.delete(userId);
    this.startNextRound(roomId);
  }

  private sendToPlayer(userId: number, payload: object): void {
    //console.log("Send_to_player: id: ", userId, payload);
    this.eventEmitter.emit('send_to_player', { userId, payload });
  }

  startNextRound(roomId: string): void {
    const active = this.activePlayers.get(roomId);
    const connected = this.gameRooms.get(roomId);
    if (!active || !connected) return;

    console.log(`[GameService] activePlayers=${this.activePlayers.get(roomId)?.size}, connected=${this.gameRooms.get(roomId)?.size}`);
    if (active.size >= 2 && connected.size == active.size && !(active.size % 2)) {
      this.combatService.matchmake(connected);
      this.startMapPhase(roomId, connected, "nextMap");
    }
  }

  private async startMapPhase(
    roomId: string,
    room: Set<number>,
    nextMap?: string,
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
        if (nextMap)
          return {userId, payload: await this.combatService.next_map(player)};
        else
          return { userId, payload: await this.mapService.start_game(player) };
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
      this.phaseTimer.startTimes.get(`game: ${roomId}`)! + PHASE_DURATIONS.team_setup;

    for (const userId of room) {
      const player = this.playerService.getPlayer(userId)!;
      player.timer = teamSetupTimer;

      const opponentId = this.combatService.getOpponentId(userId);
      const enemy = opponentId ? this.playerService.getPlayer(opponentId) : undefined;
      if (!enemy) {
        console.log(`[GameService]: No opponent for ${userId} (room ${roomId}) - using player as placeholder`);
      }

		// TEST MATCHMAKING //
		console.log('USER ID: ', userId, /* ': ', this.team_setup(player, enemy ?? player) */);
		console.log('OPONNENT ID: ', opponentId);
		console.log('******************');
		//******************************//

      this.sendToPlayer(userId, this.mapService.team_setup(player, enemy ?? player));
    }
  }

  private startCombatPhase(roomId: string, room: Set<number>) {
    this.phaseTimer.start(`game: ${roomId}`, 'choose_action', () => {
      console.log(`Room ${roomId} choose_action timeout`);

    });

    const combatTimer =
      this.phaseTimer.startTimes.get(`game: ${roomId}`)! + PHASE_DURATIONS.choose_action;

    for (const userId of room) {
      const player = this.playerService.getPlayer(userId)!;
      player.timer = combatTimer;
      }

    console.log('Combat timer started');
  }

  private startNewTurn(roomId: string, room: Set<number>) {
    this.phaseTimer.start(`game: ${roomId}`, 'choose_action', () => {
      console.log(`Room ${roomId} choose_action timeout`);

    });

    const actionTimer =
      this.phaseTimer.startTimes.get(`game: ${roomId}`)! + PHASE_DURATIONS.choose_action;

    for (const userId of room) {
      const player = this.playerService.getPlayer(userId)!;
      player.timer = actionTimer;
      }

    console.log('New Turn timer started');
  }


  private has_valid_monsters(player: Player): boolean {
    for (const monster of player.battle_team) {
        if (monster.name !== "" && monster.life.current > 0) {
            return true;
        }
    }
    return false;
  }

  async handleMessage(userId: number, payload: any) : Promise<object | undefined> {
    let endOfBattle = false;
    let loser;
    let player = this.playerService.getPlayer(userId)!;
    let userId2 = this.combatService.getOpponentId(userId);
    const roomId = this.roomIdByPlayer.get(userId)!;
    
    if (!userId2) {
      console.log(`[GameService]: userId2 for ${userId} is missing - using userId as placeholder`);
      userId2 = userId;
    }
    let player2 = userId2 ? this.playerService.getPlayer(userId2) : undefined;

    let playerForce : Player | undefined = undefined;
    if (player.forceChooseMonster)
        playerForce = player;
    else if (player2?.forceChooseMonster)
        playerForce = player2;

    if (!player2) {
      console.log(`[GameService]: No opponent for ${userId} - using player as placeholder`);
      player2 = player;
    }
    let result: object | undefined
    const state = payload?.state
    console.log("STATE", state);
    switch (state) {
      case "add_item":
        result = await this.mapService.received_add_item(player)
        break;
      case "delete_item":
        result = await this.mapService.received_delete_item(player, payload.item)
        break;
      case "item_request":
        result = await this.mapService.received_request_item(player)
        break;
      case "use_item": {
		    this.sendToPlayer(userId, this.mapService.received_delete_item(player, payload.item));
        result = await this.mapService.received_use_item(player, payload.item)
        break;
      }
      case "new_encounter":
        result = await this.mapService.received_new_encounter(player, payload.tile)
        break;
      case "try_catch":
        result = await this.mapService.received_try_catch(player)
        break;
      case "delete_monster":
        result = await this.mapService.received_delete_monster(player, payload.monster)
        break;
      case "team_choice":
        result = await this.mapService.received_team_choice(player, payload.battle_team)
        break;
      case "change_current_monster":
      case "use_item_combat":
      case "try_attack":
      case "pass":
          player.currentActions = { 
            actionType: state,
            data: payload
          }
//          console.log("Current actions", player.currentActions);
//		    	console.log("ForceChooseMonster [game]", player.forceChooseMonster);			
          if ((player.currentActions.actionType && player2.currentActions.actionType) || playerForce?.forceChooseMonster) {
            const mapResult = await this.combatService.resolving_battle_round(player, player2);
            player.currentActions.actionType = undefined;
            player2.currentActions.actionType = undefined;
            if (mapResult && mapResult.get(player.id) !== undefined && mapResult.get(player2.id) !== undefined){
              const currentMessagePlayer = mapResult.get(player.id);
              const currentMessagePlayer2 = mapResult.get(player2.id);
//              console.log("* CurrentMessagePlayer1 *: ", mapResult.get(player.id));
//              console.log("*************************************");
//              console.log("* CurrentMessagePlayer2 *: ", mapResult.get(player2.id));
//              console.log("*************************************");

              for (let i = 0; i < currentMessagePlayer!.length; ++i){
                this.sendToPlayer(userId, currentMessagePlayer?.at(i)!);
                this.sendToPlayer(userId2, currentMessagePlayer2?.at(i)!);
              }
            }
            else {
              console.log("Waiting Player: ");
              break;
            }
            await new Promise(resolve => setTimeout(resolve, 2000)); // ! "temp fix to synchronizeke"

            if (player.currentMonster.life.current <= 0){
                if (!this.has_valid_monsters(player)){
                  endOfBattle = true;
                  loser = userId;
                  this.sendToPlayer(userId, this.combatService.result_battle(player, player2.id));
                  this.sendToPlayer(userId2, this.combatService.result_battle(player2, player2.id));
                  // wainting all combat finish
                }
                else{
                  player.forceChooseMonster = true;
                  this.sendToPlayer(userId, this.combatService.change_monster(player, player.id));
                  this.sendToPlayer(userId2, this.combatService.change_monster(player2, player.id));
                }
            }
            else if (player2.currentMonster.life.current <= 0){
              if (!this.has_valid_monsters(player2)){
                endOfBattle = true;
                loser = userId2;
                this.sendToPlayer(userId, this.combatService.result_battle(player, player.id));
                this.sendToPlayer(userId2, this.combatService.result_battle(player2, player.id));
              }          
              else {
                player2.forceChooseMonster = true;
                this.sendToPlayer(userId, this.combatService.change_monster(player, player2.id));
                this.sendToPlayer(userId2, this.combatService.change_monster(player2, player2.id));
             }
            }
            else {
//		    	    console.log("ForceChooseMonster [new_turn]", player.forceChooseMonster);	
              this.startNewTurn(roomId, this.gameRooms.get(roomId)!);
              this.sendToPlayer(userId, this.combatService.new_turn(player));
              this.sendToPlayer(userId2, this.combatService.new_turn(player2));
              // si un combat deja finish declenchement du roundLeft
              // send new_turn(player, rounLeft)
              // send new_turn(player, roundLeft)                                                                                                                                                            
            }
            if (endOfBattle) {
              const winner = loser === userId ? userId2 : userId;

              const roomId = this.combatService.playerCombatRoom.get(loser);
              const players = this.combatService.combatRooms.get(roomId!);

              this.combatService.playerCombatRoom.delete(loser);
              this.combatService.playerCombatRoom.delete(winner);
              this.combatService.combatRooms.delete(roomId!);
              this.eventEmitter.emit('delete_user', { userId: loser });
            }
        }
        break;
      default:
          console.log("Unknow state:", state);
          return undefined;
    }
    return result
  }
} 