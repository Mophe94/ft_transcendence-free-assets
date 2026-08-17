import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from './player/player.service';
import { MapService } from './map.service';
import { Player } from './player/player';
import { CombatService } from './combat.service';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { FULL, PHASE_DURATIONS } from 'apps/game-service/src/game/game.type';
import { RedisService } from '../redis/redis.service';
import { RedisStateService } from '../redis/redis_state.service';

@Injectable()
export class GameService {
  constructor(
    private eventEmitter: EventEmitter2,
    private phaseTimer: PhaseTimerService,
    private playerService: PlayerService,
    private combatService: CombatService,
    private mapService: MapService,
    private redisService: RedisService,
    private redisStateService: RedisStateService,
  ) {}

  /*  ATTRIBUTES  */

  // roomId -> usersIds
  private gameRooms = new Map<string, Set<string>>();
  // userId -> roomId
  private roomIdByPlayer = new Map<string, string>();
  // roomIds -> authorized players
  private readonly authorizedPlayers = new Map<string, Set<number>>();
  // roomId -> active players
  private activePlayersByRoom = new Map<string, Set<string>>();

  getRoomById(userId: string) {
    return this.roomIdByPlayer.get(userId);
  }

  /*  GAME ROOMS */

  registerRoom(roomId: string, userIds: string[]): void {
    //this.authorizedPlayers.set(roomId, new Set(userIds));
    this.activePlayersByRoom.set(roomId, new Set(userIds));
  }

  isPlayerInRoom(userId: number, roomId: string): boolean {
    return this.authorizedPlayers.get(roomId)?.has(userId) ?? false;
  }

  private joinGameRoom(roomId: string, userId: string): Set<string> {
    let roomPlayers = this.gameRooms.get(roomId);
    if (!roomPlayers) {
      roomPlayers = new Set();
      this.gameRooms.set(roomId, roomPlayers);
    }
    roomPlayers.add(userId);
    return roomPlayers;
  }

  private leaveGameRoom(roomId: string, userId: string): void {
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
    userId: string,
    roomId: string,
  ): Promise<void> {
    const roomPlayers = this.joinGameRoom(roomId, userId);
    this.roomIdByPlayer.set(userId, roomId);
    console.log(`Size = ${roomPlayers.size}, RoomId = ${roomId}`);

    // Init or retrieve Player
    //if (!this.playerService.getPlayer(userId))
    this.playerService.initPlayer(userId);
    const player = this.playerService.getPlayer(userId)!;

    // change FULL for real room capacity
    console.log('ON GODOT CONNECTED ROUND REMAINING: ', player.roundsRemaining);

    let activePlayers = this.activePlayersByRoom.get(roomId);
    if (!activePlayers) {
      activePlayers = new Set();
      this.activePlayersByRoom.set(roomId, activePlayers);
    }
    activePlayers.add(userId);

    console.log('Active Players at start: ', this.activePlayersByRoom);
    console.log('*********************************************');
    player.roundsRemaining = Math.log2(FULL); //this.activePlayersByRoom.get(roomId)?.size! / 2;

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

      this.startMapPhase(roomId, roomPlayers);
    }
  }

  async onGodotDisconnected(userId: string, roomId: string): Promise<void> {
    const room = this.gameRooms.get(roomId);
    if (!room || !room.has(userId)) return;
    /////////////////////////////////* REDIS STATE : REMOVE PLAYER */////////////////////////////////
    await this.redisStateService.removePlayer(userId.toString());
    /////////////////////////////////* END */////////////////////////////////

    const player = this.playerService.getPlayer(userId);
    const wasEliminated = player?.status === 'loser' || (player?.status === 'winner' && player.roundsRemaining === 0);

    this.leaveGameRoom(roomId, userId);
    this.activePlayersByRoom.get(roomId)?.delete(userId);

    if (wasEliminated)
      this.startNextRound(roomId);
    else
      this.deleteAbortedGame(roomId, userId);
  }

  // Big cleaning -> see with IA
  private deleteAbortedGame(roomId: string, disconnectedUserId: string): void {
    const remaining = this.gameRooms.get(roomId);
    const allInvolved = new Set(remaining ?? []);
    allInvolved.add(disconnectedUserId);

    for (const id of allInvolved) {
      const combatRoomId = this.combatService.playerCombatRoom.get(id);
      if (combatRoomId) {
        this.combatService.combatRooms.delete(combatRoomId);
        this.phaseTimer.clear(`combat: ${combatRoomId}`);
      }
      this.combatService.playerCombatRoom.delete(id);
      this.roomIdByPlayer.delete(id);
      if (id !== disconnectedUserId)
       this.eventEmitter.emit('close_player_socket', { userId: id });
    }
    this.combatService.playerCombatRoom.delete(disconnectedUserId);
    this.roomIdByPlayer.delete(disconnectedUserId);

    this.phaseTimer.clear(`game: ${roomId}`);

    this.gameRooms.delete(roomId);
    this.activePlayersByRoom.delete(roomId);
    this.authorizedPlayers.delete(roomId);
  }

  private async eliminatePlayer(userId: string, roomId: string): Promise<void> {
    console.log(
      `[GameService] Eliminating player ${userId} from room ${roomId}`,
    );
    // IF BOT?
    if (userId === '') {
      await this.onGodotDisconnected(userId, roomId);
      return;
    }
    this.eventEmitter.emit('close_player_socket', { userId });
  }

  private sendToPlayer(userId: string, payload: object): void {
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

    console.log('Active Players in startNextRound ', active);
    console.log('Connected Players in startNextRound ', connected);
    console.log('*********************************************');
    if (allCombatsFinished && canPairEveryone) {
      console.log(
        'Active Players allCombatsFinished && canPairEveryone: ',
        active,
      );
      console.log(
        'Connected Players allCombatsFinished && canPairEveryone: ',
        connected,
      );
      console.log('*********************************************');
      this.combatService.matchmake(connected);
      this.startMapPhase(roomId, connected, true);
    } else if (allCombatsFinished && active.size === 1) {
      //console.log('Active Players last winner:  ', active);
      //console.log('Connected Players last winner: ', connected);
      console.log('*********************************************');
      const winnerId = [...active][0];
      if (winnerId) {
        this.deleteEndGame(roomId, winnerId);
        this.combatService.playerCombatRoom.delete(winnerId);
      }
      console.log("Game rooms end game: ", this.gameRooms);
      //console.log(`End of game: everything should be cleanup at this point!`);
      return;
    }
  }

  private deleteEndGame(roomId: string, winnerId: string) : void {
    this.phaseTimer.clear(`game: ${roomId}`);
    this.gameRooms.delete(roomId);
    this.activePlayersByRoom.delete(roomId);
    this.authorizedPlayers.delete(roomId);
    this.roomIdByPlayer.delete(winnerId);
    this.combatService.playerCombatRoom.delete(winnerId);

    Promise.all([
      //this.redisStateService.removePlayer(userId),
      this.redisService.deleteRoom(roomId),
      this.redisService.removeActiveRoom(roomId),
    ]).catch((err) => 
      console.log([`GameService] deleteRoom: failed cleaning of ${roomId}`]));
  }

  private startMapPhase(
    roomId: string,
    roomPlayers: Set<string>,
    nextRound = false,
  ): void {
    this.phaseTimer.start(`game: ${roomId}`, 'map', () => {
      console.log(`Room ${roomId} map phase timeout`);
      this.startTeamSetupPhase(roomId, roomPlayers);
    });

    const mapTimer =
      this.phaseTimer.startTimes.get(`game: ${roomId}`)! + PHASE_DURATIONS.map;

    const payloads = [...roomPlayers].map((userId) => {
      const player = this.playerService.getPlayer(userId)!;
      player.timer = mapTimer;
      if (nextRound) {
        return { userId, payload: this.combatService.next_map(player) };
      } else return { userId, payload: this.mapService.start_game(player) };
    });

    payloads.forEach(({ userId, payload }) =>
      this.sendToPlayer(userId, payload),
    );
    console.log(
      `[GameService]: startMapPhase -> start_game sent to ${roomPlayers.size} players of ${roomId}`,
    );
  }

  private startTeamSetupPhase(roomId: string, roomPlayers: Set<string>) {
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

  private startCombatPhase(roomId: string, roomPlayers: Set<string>) {
    const handled = new Set<string>();

    for (const userId of roomPlayers) {
      if (handled.has(userId)) continue;

      const opponentId = this.combatService.getOpponentId(userId);
      const combatRoomId = this.combatService.playerCombatRoom.get(userId);
      if (!combatRoomId) {
        console.log(`[GameService]: start CombatPhase -> missing combatRoomId for ${userId}`);
        continue;
      }
      
      const timerKey = `combat: ${combatRoomId}`;

      this.phaseTimer.start(timerKey, 'choose_action', () => {
        console.log(`Combat ${roomId} choose_action timeout`);
        this.actionTimeout(combatRoomId);
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

  private startNewTurn(combatRoomId: string, room: Set<string>) {
    
    const timerKey = combatRoomId ? `combat: ${combatRoomId}` : undefined;
    if (!combatRoomId) {
      console.log('[GameService] - StartNewTurn -> combatRoomId undefined');
      return;
    }
    if (!timerKey) return;

    this.phaseTimer.start(timerKey, 'choose_action', () => {
      console.log(`Room ${combatRoomId} choose_action timeout`);
      this.actionTimeout(combatRoomId);
    });

    const actionTimer =
      this.phaseTimer.startTimes.get(timerKey)! + PHASE_DURATIONS.choose_action;

    for (const userId of room) {
      this.playerService.getPlayer(userId)!.timer = actionTimer;
    }
    console.log('New Turn timer started');
  }

  private actionTimeout(combatRoomId: string): void {
    const room = this.combatService.combatRooms.get(combatRoomId);
    if (!room) {
      console.log( `[GameService] actionTimeout -> unknow combat room ${combatRoomId}`);
      return;
    }

    const [userId, userId2] = room;
    const player = this.playerService.getPlayer(userId);
    const player2 = this.playerService.getPlayer(userId2);
    if (!player || !player2) {
      console.log(`[GameService]: actionTimeout -> missing player(s) for room ${combatRoomId}`);
      return
    }

    console.log("player.currentActions BEFORE; ", player.currentActions.actionType);
    console.log("player2.currentActions BEFORE; ", player2.currentActions.actionType);

    // if (player.forceChooseMonster) -> if !currentMonster 
    const forcedMonster = player.forceChooseMonster || player2.forceChooseMonster;
    if (forcedMonster) {
      if (player.forceChooseMonster && player.currentActions.actionType === undefined) {
          this.autoChooseMonster(userId, player);
      }
      if (player2.forceChooseMonster && player2.currentActions.actionType === undefined) {
        this.autoChooseMonster(userId2, player2);
      }
    }
    else {
      if (player.currentActions.actionType === undefined) {
        if (this.needMonsterChoice(player))
          this.autoChooseMonster(userId, player);
        else
          this.autoPass(userId, player);
      }
      if (player2.currentActions.actionType === undefined) {
        if (this.needMonsterChoice(player2))
          this.autoChooseMonster(userId2, player2);
        else this.autoPass(userId2, player2);
      }
    }

    this.resolveTurn(userId, player, player2);
  }

  private needMonsterChoice(player: Player): boolean {
    return player.currentMonster.name === "" || player.currentMonster.life.current <= 0;
  }

  private autoChooseMonster(userId: string, player: Player): void {
    if (player.currentActions.actionType !== undefined) return;
    console.log(`[GameService]: Auto-choose monster for player ${userId} (timeout)`);
    player.currentActions = { 
      actionType: 'change_current_monster',
      data: { slot: -1, state: 'change_current_monster'},
    }
  }

  private autoPass(userId: string, player: Player): void {
    if (player.currentActions.actionType !== undefined) return;

    console.log(`[GameService]: Auto-pass for player ${userId} (timeout)`);
    player.currentActions = {
      actionType: 'pass',
      data: {state: 'pass'},
    }
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
    userId: string,
    payload: any,
  ): Promise<object | undefined> {
    const player = this.playerService.getPlayer(userId)!;
    const userId2 = this.combatService.getOpponentId(userId);
    const roomId = this.roomIdByPlayer.get(userId)!;
    const state = payload?.state;
    console.log('STATE', state);

    if (state === 'safe_to_disconnect') {

      await new Promise<void>(resolve => setTimeout(resolve, 5000));
      
      if (player.status === 'loser')
        await this.eliminatePlayer(player.id, roomId);
      if (player.status === 'winner' && player.roundsRemaining === 0)
        await this.eliminatePlayer(player.id, roomId);
      return undefined;
    }

    if (!userId2) {
      console.log(`[GameService]: userId2 for ${userId} is missing`);
      return undefined;
    }

    const player2 = userId2 ? this.playerService.getPlayer(userId2) : undefined;

    if (!player2) {
      console.log(`[GameService]: No opponent for ${userId}`);
      return undefined;
    }

    let result: object | undefined;
    switch (state) {
      case 'add_item':
        result = this.mapService.received_add_item(player);
        break;
      case 'delete_item':
        result = this.mapService.received_delete_item(player, payload.item);
        break;
      case 'item_request':
        result = await this.mapService.received_request_item(player);
        break;
      case 'use_item': {
        this.sendToPlayer(
          userId,
          this.mapService.received_delete_item(player, payload.item),
        );
        result = this.mapService.received_use_item(player, payload.item);
        break;
      }
      case 'new_encounter':
        result = await this.mapService.received_new_encounter(
          player,
          payload.tile,
        );
        break;
      case 'try_catch':
        result = this.mapService.received_try_catch(player);
        break;
      case 'delete_monster':
        result = this.mapService.received_delete_monster(
          player,
          payload.monster,
        );
        break;
      case 'team_choice': {
        const error = await this.mapService.received_team_choice(
          player,
          payload.battle_team,
        );
        if (error) {
          console.log("TEAM CHOICE PAYLOAD ERROR", error);
          result = error;
          break;
        }
        player.teamReady = true;

        if (player2.teamReady) {
          this.startCombatPhase(roomId, new Set([userId, userId2]));
          this.sendToPlayer(userId, this.mapService.combat(player));
          this.sendToPlayer(userId2, this.mapService.combat(player2));
        }
        else
        result = {event: 'game', data: { state: 'waiting_for_opponent'}};
        break;
    }
      case 'change_current_monster':
      case 'use_item_combat':
      case 'try_attack':
      case 'pass':
        player.currentActions = {
          actionType: state,
          data: payload,
        };
        this.resolveTurn(userId, player, player2);
        break;
      default:
        console.log('Unknow state:', state);
        return undefined;
    }
    return result;
  }

  private resolveTurn(
    userId: string,
    player: Player,
    player2: Player,
  ): void {
    const combatRoomId = this.combatService.playerCombatRoom.get(userId);
    if (!combatRoomId) {
      console.log(
        `[GameService]: Missing combat room at end of combat, userId=${userId}`,
        userId,
      );
      return;
    }

    let playerForce: Player | undefined = undefined;
    if (player.forceChooseMonster) playerForce = player;
    else if (player2?.forceChooseMonster) playerForce = player2;

    const userId2 = this.combatService.getOpponentId(userId);
    if (!userId2) return;

    console.log("player.currentActions; ", player.currentActions.actionType);
    console.log("player2.currentActions; ", player2.currentActions.actionType);

    const bothPlayersActed =
      !!player.currentActions.actionType && !!player2.currentActions.actionType;
    if (!bothPlayersActed && !playerForce?.forceChooseMonster) return;

    const roundResolved = this.applyBattleRound(
      player,
      player2,
      userId,
      userId2,
    );
    if (!roundResolved) return; // waiting on opponent't result;

    let endOfBattle: boolean;
    if (player.currentMonster.life.current <= 0) {
      endOfBattle = this.resolveMonsterKO(
        player,
        player2,
        userId,
        userId2,
        /* KO */ player,
        player2,
      );
    } else if (player2.currentMonster.life.current <= 0) {
      endOfBattle = this.resolveMonsterKO(
        player,
        player2,
        userId,
        userId2,
        /* KO */ player2,
        player,
      );
    } else {
      endOfBattle = false;
      console.log("PLAYER ACTION BEFORE NEW TURN", player.currentActions.actionType);
      console.log("PLAYER2 ACTION BEFORE NEW TURN", player2.currentActions.actionType);
      this.startNewTurn(combatRoomId, new Set([userId, userId2]));
      this.sendToPlayer(userId, this.combatService.new_turn(player));
      this.sendToPlayer(userId2, this.combatService.new_turn(player2));

      // si un combat deja finish declenchement du roundLeft
      // send new_turn(player, rounLeft)
      // send new_turn(player, roundLeft)
    }
    if (endOfBattle) {

      this.finalizeBattleEnd(player, player2, combatRoomId);
    }
  }

  private applyBattleRound(
    player: Player,
    player2: Player,
    userId: string,
    userId2: string,
  ): boolean {

    const mapResult = this.combatService.resolving_battle_round(
      player,
      player2,
    );


    if (
      !mapResult ||
      mapResult.get(player.id) === undefined ||
      mapResult.get(player2.id) === undefined
    ) {
      console.log('Waiting Player: ');
      return false;
    }

    const messagesForPlayer = mapResult.get(player.id)!;
    const messagesForPlayer2 = mapResult.get(player2.id)!;

    for (let i = 0; i < messagesForPlayer.length; ++i) {
      this.sendToPlayer(userId, messagesForPlayer.at(i)!);
      this.sendToPlayer(userId2, messagesForPlayer2.at(i)!);
    }

    player.currentActions.actionType = undefined;
    player2.currentActions.actionType = undefined;

    return true;
  }

  private resolveMonsterKO(
    player: Player,
    player2: Player,
    userId: string,
    userId2: string,
    koPlayer: Player,
    otherPlayer: Player,
  ): boolean {
    if (!this.has_valid_monsters(koPlayer)) {
      koPlayer.status = 'loser';
      otherPlayer.status = 'winner';

      // Adapt rounds left
      koPlayer.roundsRemaining -= 1;
      otherPlayer.roundsRemaining -= 1;

      this.sendToPlayer(
        userId,
        this.combatService.result_battle(player, otherPlayer.id),
      );
      this.sendToPlayer(
        userId2,
        this.combatService.result_battle(player2, otherPlayer.id),
      );

      return true;
    }

    koPlayer.forceChooseMonster = true;

    // AutoChooseMonster case
    const combatRoomId = this.combatService.playerCombatRoom.get(userId);
    if (combatRoomId) {
      this.startNewTurn(combatRoomId, new Set([userId, userId2]));
      this.sendToPlayer(userId, this.combatService.new_turn(player));
      this.sendToPlayer(userId, this.combatService.new_turn(player));
    }
    else {
      console.log(`[GameService]: resolveMonsterKO -> missing combatRoomIdfor ${userId}`);
    }

    this.sendToPlayer(
      userId,
      this.combatService.change_monster(player, koPlayer.id),
    );
    this.sendToPlayer(
      userId2,
      this.combatService.change_monster(player2, koPlayer.id),
    );

    return false;
  }

  private async finalizeBattleEnd(
    player: Player,
    player2: Player,
    combatRoomId: string,
  ): Promise<void> {
    const winner = player.status === 'loser' ? player2 : player;
    const loser = player.status === 'loser' ? player : player2;

    this.combatService.playerCombatRoom.delete(loser.id);
    this.combatService.playerCombatRoom.delete(winner.id);
    this.combatService.combatRooms.delete(combatRoomId);
    this.phaseTimer.clear(`combat: ${combatRoomId}`);

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
