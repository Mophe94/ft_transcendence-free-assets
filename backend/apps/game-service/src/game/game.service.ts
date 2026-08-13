import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from './player/player.service';
import { MapService } from './map.service';
import { Player } from './player/player';
import { CombatService } from './combat.service';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { FULL, PHASE_DURATIONS } from 'apps/game-service/src/game/game.type';
import { RedisStateService } from '../redis/redis_state.service';

@Injectable()
export class GameService implements OnModuleInit {
  constructor(
    private eventEmitter: EventEmitter2,
    private phaseTimer: PhaseTimerService,
    private playerService: PlayerService,
    private combatService: CombatService,
    private mapService: MapService,
    private redisStateService: RedisStateService,
  ) {}

  /*  ATTRIBUTES  */

  // roomId -> usersIds
  private gameRooms = new Map<string, Set<number>>();
  // userId -> roomId
  private roomIdByPlayer = new Map<number, string>();
  // roomIds -> authorized players
  private readonly authorizedPlayers = new Map<string, Set<number>>();
  // roomId -> active players
  private activePlayersByRoom = new Map<string, Set<number>>();

  getRoomById(userId: number) {
    return this.roomIdByPlayer.get(userId);
  }

  /*  INITIALIZATION with hardcoded values */
  onModuleInit(): void {
    //this.registerRoom('test-room', [1, 2]);
  }

  /*  GAME ROOMS */

  registerRoom(roomId: string, userIds: number[]): void {
    //this.authorizedPlayers.set(roomId, new Set(userIds));
    this.activePlayersByRoom.set(roomId, new Set(userIds));
  }

  isPlayerInRoom(userId: number, roomId: string): boolean {
    return this.authorizedPlayers.get(roomId)?.has(userId) ?? false;
  }

  private joinGameRoom(roomId: string, userId: number): Set<number> {
    let roomPlayers = this.gameRooms.get(roomId);
    if (!roomPlayers) {
      roomPlayers = new Set();
      this.gameRooms.set(roomId, roomPlayers);
    }
    roomPlayers.add(userId);
    return roomPlayers;
  }

  private async leaveGameRoom(roomId: string, userId: number): Promise<void> {
    const room = this.gameRooms.get(roomId);
    if (!room) return;
    room.delete(userId);
    if (room.size === 0) {
      this.gameRooms.delete(roomId);
    }
  }

  /*  GAME  */

  async onGodotConnected(
    client: WebSocket,
    userId: number,
    roomId: string,
  ): Promise<void> {
    const roomPlayers = this.joinGameRoom(roomId, userId);
    this.roomIdByPlayer.set(userId, roomId);
    console.log(`Size = ${roomPlayers.size}, RoomId = ${roomId}`);

    // Init or retrieve Player
    if (!this.playerService.getPlayer(userId))
      this.playerService.initPlayer(userId);
    const player = this.playerService.getPlayer(userId)!;

    // change FULL for real room capacity
    console.log("Active Players at start: ", this.activePlayersByRoom)
    console.log("*********************************************");
    player.roundsRemaining = Math.log2(FULL); //this.activePlayersByRoom.get(roomId)?.size! / 2;
    console.log('ON GODOT CONNECTED ROUND REMAINING: ', player.roundsRemaining);

    let activePlayers = this.activePlayersByRoom.get(roomId);
    if (!activePlayers) {
      activePlayers = new Set();
      this.activePlayersByRoom.set(roomId, activePlayers);
    }
    activePlayers.add(userId);

    // FULL need to be repalaced by the real capacity of the room retrieved from redis
    if (
      roomPlayers.size === FULL /* this.activePlayersByRoom.get(roomId)?.size */
    ) {
      /////////////////////////////////* REDIS STATE : ADD ALL PLAYERS AND STATE */////////////////////////////////
      for (const userId of roomPlayers) {
        const playerState = this.playerService.getPlayer(userId)!;
        await this.redisStateService.updateStatePlayer(
          userId.toString(),
          playerState,
        );
      }
      /////////////////////////////////* END */////////////////////////////////
      this.combatService.matchmake(roomPlayers);
      // TEST MATCHMAKING //
      for (const userId of roomPlayers) {
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

      await this.startMapPhase(roomId, roomPlayers);
    }
  }

  async onGodotDisconnected(userId: number, roomId: string): Promise<void> {
    const room = this.gameRooms.get(roomId);
    if (!room || !room.has(userId)) return;
    /////////////////////////////////* REDIS STATE : REMOVE PLAYER */////////////////////////////////
    await this.redisStateService.removePlayer(userId.toString());
    /////////////////////////////////* END */////////////////////////////////
    this.leaveGameRoom(roomId, userId);
    this.activePlayersByRoom.get(roomId)?.delete(userId);

    this.startNextRound(roomId);
  }

  private async eliminatePlayer(userId: number, roomId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 11000)); // ! "temp fix to synchronizeke"
    console.log(
      `[GameService] Eliminating player ${userId} from room ${roomId}`,
    );
    // IF BOT? 
    if (userId < 0) {
      await this.onGodotDisconnected(userId, roomId);
      return;
    }
    this.eventEmitter.emit('close_player_socket', { userId });
  }

  private sendToPlayer(userId: number, payload: object): void {
    //console.log("Send_to_player: id: ", userId);
    this.eventEmitter.emit('send_to_player', { userId, payload });
  }

  startNextRound(roomId: string): void {
    const active = this.activePlayersByRoom.get(roomId);
    const connected = this.gameRooms.get(roomId);
    if (!active || !connected) return;

    console.log(
      `[GameService] activePlayersByRoom=${this.activePlayersByRoom.get(roomId)?.size}, connected=${this.gameRooms.get(roomId)?.size}`,
    );

    const allCombatsFinished = connected.size === active.size;
    const canPairEveryone = active.size >= 2 && active.size % 2 === 0;

    console.log("Active Players in startNextRound ", active);
    console.log("Connected Players in startNextRound ", connected);
    console.log("*********************************************");
    if (allCombatsFinished && canPairEveryone) {
      console.log("Active Players allCombatsFinished && canPairEveryone: ", active);
      console.log("Connected Players allCombatsFinished && canPairEveryone: ", connected);
      console.log("*********************************************");
      this.combatService.matchmake(connected);
      this.startMapPhase(roomId, connected, true);
    }
    else if (allCombatsFinished && active.size === 1) {
      //To do big cleaning of the winner / room etc
      console.log("Active Players last winner:  ", active);
      console.log("Connected Players last winner: ", connected);
      console.log("*********************************************");
      console.log(`End of game: everything should be cleanup at this point!`);
      return;
    }
  }

  private async startMapPhase(
    roomId: string,
    roomPlayers: Set<number>,
    nextRound = false,
  ): Promise<void> {
    this.phaseTimer.start(`game: ${roomId}`, 'map', () => {
      console.log(`Room ${roomId} map phase timeout`);
      this.startTeamSetupPhase(roomId, roomPlayers);
    });

    const mapTimer =
      this.phaseTimer.startTimes.get(`game: ${roomId}`)! + PHASE_DURATIONS.map;

    const payloads = await Promise.all(
      [...roomPlayers].map(async (userId) => {
        const player = this.playerService.getPlayer(userId)!;
        player.timer = mapTimer;
        if (nextRound) {
          return { userId, payload: this.combatService.next_map(player) };
        } else
          return { userId, payload: await this.mapService.start_game(player) };
      }),
    );

    payloads.forEach(({ userId, payload }) =>
      this.sendToPlayer(userId, payload),
    );
    console.log(
      `[GameService]: startMapPhase -> start_game sent to ${roomPlayers.size} players of ${roomId}`,
    );
  }

  private startTeamSetupPhase(roomId: string, roomPlayers: Set<number>) {
    this.phaseTimer.start(`game: ${roomId}`, 'team_setup', () => {
      console.log(`Room ${roomId} team_setup phase timeout`);
    });
    const teamSetupTimer =
      this.phaseTimer.startTimes.get(`game: ${roomId}`)! +
      PHASE_DURATIONS.team_setup;

    for (const userId of roomPlayers) {
      const player = this.playerService.getPlayer(userId)!;
      player.timer = teamSetupTimer;
      player.teamReady = false;

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

      this.sendToPlayer(
        userId,
        this.mapService.team_setup(player, enemy ?? player),
      );
    }
  }

  private startCombatPhase(roomId: string, roomPlayers: Set<number>) {
    const handled = new Set<number>();

    for (const userId of roomPlayers) {
      if (handled.has(userId)) continue;

      const opponentId = this.combatService.getOpponentId(userId);
      const combatRoomId = this.combatService.playerCombatRoom.get(userId);
      const timerKey = `combat: ${combatRoomId}`;

      this.phaseTimer.start(timerKey, 'choose_action', () => {
        console.log(`Combat ${roomId} choose_action timeout`);
      });

      const combatTimer =
        this.phaseTimer.startTimes.get(timerKey)! +
        PHASE_DURATIONS.choose_action;

      this.playerService.getPlayer(userId)!.timer = combatTimer;
      handled.add(userId);
      if (opponentId) {
        this.playerService.getPlayer(opponentId)!.timer = combatTimer;
        handled.add(opponentId);
      }
    }
    console.log('Combat timer started');
  }

  private startNewTurn(combatRoomId: string, room: Set<number>) {
    const timerKey = combatRoomId ? `combat: ${combatRoomId}` : undefined;
    if (!combatRoomId) {
      console.log('[GameService] - StartNewTurn -> combatRoomId undefined');
      return;
        
    }
    if (!timerKey) return;

    this.phaseTimer.start(timerKey, 'choose_action', () => {
      console.log(`Room ${combatRoomId} choose_action timeout`);
      // const room = this.combatService.combatRooms.get(combatRoomId);
      // if (!room) {
      //     console.log("Combat room not found");
      //     return;
      // }
      // const [ userId, userId2 ] = room;
      // let player = this.playerService.getPlayer(userId);
      // let player2 = this.playerService.getPlayer(userId2);
      // if (!player || !player2)
      //   return;
      // if (player.currentActions.actionType === undefined) {
      //   player.currentActions.actionType = "pass";
      //   // need to create a getter
      //   this.combatService.handle_action(player, player2, player.currentActions, 1);
      // }
      // if (player2.currentActions.actionType === undefined) {
      //   player2.currentActions.actionType = "pass";
      //   // need to create a getter
      //   this.combatService.handle_action(player2, player, player2.currentActions, 1);
      // }
    });

    const actionTimer =
      this.phaseTimer.startTimes.get(timerKey)! + PHASE_DURATIONS.choose_action;

    for (const userId of room) {
      this.playerService.getPlayer(userId)!.timer = actionTimer;
    }
    console.log('New Turn timer started');
  }

  private has_valid_monsters(player: Player): boolean {
    for (const monster of player.battle_team) {
      if (monster.name !== '' && monster.life.current > 0) {
        return true;
      }
    }
    return false;
  }

  async handleMessage(
    userId: number,
    payload: any,
  ): Promise<object | undefined> {
    let player = this.playerService.getPlayer(userId)!;
    let userId2 = this.combatService.getOpponentId(userId);
    const roomId = this.roomIdByPlayer.get(userId)!;

    if (!userId2) {
      console.log(`[GameService]: userId2 for ${userId} is missing`);
      return undefined;
    }

    let player2 = userId2 ? this.playerService.getPlayer(userId2) : undefined;

    let playerForce: Player | undefined = undefined;
    if (player.forceChooseMonster) playerForce = player;
    else if (player2?.forceChooseMonster) playerForce = player2;

    if (!player2) {
      console.log(`[GameService]: No opponent for ${userId}`);
      return undefined;
    }

    let result: object | undefined;
    const state = payload?.state;
    console.log('STATE', state);
    switch (state) {
      case 'add_item':
        result = await this.mapService.received_add_item(player);
        break;
      case 'delete_item':
        result = await this.mapService.received_delete_item(
          player,
          payload.item,
        );
        break;
      case 'item_request':
        result = await this.mapService.received_request_item(player);
        break;
      case 'use_item': {
        this.sendToPlayer(
          userId,
          this.mapService.received_delete_item(player, payload.item),
        );
        result = await this.mapService.received_use_item(player, payload.item);
        break;
      }
      case 'new_encounter':
        result = await this.mapService.received_new_encounter(
          player,
          payload.tile,
        );
        break;
      case 'try_catch':
        result = await this.mapService.received_try_catch(player);
        break;
      case 'delete_monster':
        result = await this.mapService.received_delete_monster(
          player,
          payload.monster,
        );
        break;
      case 'team_choice':
        const error = await this.mapService.received_team_choice(
          player,
          payload.battle_team,
        );
        if (error) {
          result = error;
          break;
        }

        player.teamReady = true;

        if (player2.teamReady) {
          this.startCombatPhase(roomId, new Set([userId, userId2]));
          this.sendToPlayer(userId, this.mapService.combat(player));
          this.sendToPlayer(userId2, this.mapService.combat(player2));
        }
        // else
        //   result = {event: 'game', data: { state: 'waiting_for_opponent'}};
        break;
      case 'change_current_monster':
      case 'use_item_combat':
      case 'try_attack':
      case 'pass':
        player.currentActions = {
          actionType: state,
          data: payload,
        };
        this.resolveTurn(userId, player, player2, playerForce!);
        break;
      case 'safe_to_disconnect':
        if (player.status === "loser")
          await this.eliminatePlayer(player.id, roomId);
        if (player.status === "winner" && player.roundsRemaining === 0)
          await this.eliminatePlayer(player.id, roomId);

      default:
        console.log('Unknow state:', state);
        return undefined;
    }
    return result;
  }

private resolveTurn(userId: number, player: Player, player2: Player, playerForce: Player): void {
  let endOfBattle = false;
  const combatRoomId = this.combatService.playerCombatRoom.get(userId);
  if (!combatRoomId) {
    console.log(
      `[GameService] Missing combat room at end of combat, userId=${userId}`,
    );
    return undefined;
  }
  //let player = this.playerService.getPlayer(userId)!;
  let userId2 = this.combatService.getOpponentId(userId);
  if (!userId2) return;
  const roomId = this.roomIdByPlayer.get(userId)!

  if (
    (player.currentActions.actionType &&
      player2.currentActions.actionType) ||
    playerForce?.forceChooseMonster
  ) {
    const mapResult = this.combatService.resolving_battle_round(
      player,
      player2,
    );
    player.currentActions.actionType = undefined;
    player2.currentActions.actionType = undefined;
    if (
      mapResult &&
      mapResult.get(player.id) !== undefined &&
      mapResult.get(player2.id) !== undefined
    ) {
      const currentMessagePlayer = mapResult.get(player.id);
      const currentMessagePlayer2 = mapResult.get(player2.id);

      for (let i = 0; i < currentMessagePlayer!.length; ++i) {
        this.sendToPlayer(userId, currentMessagePlayer?.at(i)!);
        this.sendToPlayer(userId2, currentMessagePlayer2?.at(i)!);
      }
    } else {
      console.log('Waiting Player: ');
      return;
    }

    if (player.currentMonster.life.current <= 0) {
      if (!this.has_valid_monsters(player)) {
        endOfBattle = true;
        player.status = "loser";
        player2.status = "winner";

        // Adapt rounds left
        player.roundsRemaining -= 1;
        player2.roundsRemaining -= 1;

        this.sendToPlayer(
          userId,
          this.combatService.result_battle(player, player2.id),
        );
        this.sendToPlayer(
          userId2,
          this.combatService.result_battle(player2, player2.id),
        );
        // waiting all combat finish
      } else {
        player.forceChooseMonster = true;
        this.sendToPlayer(
          userId,
          this.combatService.change_monster(player, player.id),
        );
        this.sendToPlayer(
          userId2,
          this.combatService.change_monster(player2, player.id),
        );
      }
    } else if (player2.currentMonster.life.current <= 0) {
      if (!this.has_valid_monsters(player2)) {
        endOfBattle = true;
        player2.status = "loser";
        player.status = "winner";
        
        // Adapt rounds left
        player.roundsRemaining -= 1;
        player2.roundsRemaining -= 1;

        this.sendToPlayer(
          userId,
          this.combatService.result_battle(player, player.id),
        );
        this.sendToPlayer(
          userId2,
          this.combatService.result_battle(player2, player.id),
        );
      } else {
        player2.forceChooseMonster = true;
        this.sendToPlayer(
          userId,
          this.combatService.change_monster(player, player2.id),
        );
        this.sendToPlayer(
          userId2,
          this.combatService.change_monster(player2, player2.id),
        );
      }
    } else {
      this.startNewTurn(combatRoomId, new Set([userId, userId2]));
      this.sendToPlayer(userId, this.combatService.new_turn(player));
      this.sendToPlayer(userId2, this.combatService.new_turn(player2));
      // si un combat deja finish declenchement du roundLeft
      // send new_turn(player, rounLeft)
      // send new_turn(player, roundLeft)
    }
    if (endOfBattle) {
      let winner = player.status === "loser" ? player2 : player;
      let loser = player.status === "loser" ? player : player2;

      this.combatService.playerCombatRoom.delete(loser.id);
      this.combatService.playerCombatRoom.delete(winner.id);
      this.combatService.combatRooms.delete(combatRoomId!);
      this.phaseTimer.clear(`combat: ${combatRoomId}`);


      console.log('END OF BATTLE: ROUNDS LEFT: ', player.roundsRemaining);
      // WINNER SCENE -END OF GAME
      if (winner.roundsRemaining === 0)
        this.sendToPlayer(winner.id, {
          event: 'game',
          data: { state: 'finish' },
        });

      // reinitialize winner
      winner.resetAfterRound();
    }
  }
  }
}