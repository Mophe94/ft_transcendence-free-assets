import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerService } from './player/player.service';
import { MapService } from './map.service';
import { Player } from './player/player';
import { CombatService } from './combat.service';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { GameMessage, GameData, RoomAcces } from 'apps/game-service/src/game/game.type';
import { PHASE_DURATIONS } from 'apps/game-service/src/game/game.type';
import { RedisService } from '../redis/redis.service';
import { RedisStateService } from '../redis/redis_state.service';
import { AiOrchestratorService } from './ai_service/ai.orchestrator.service';
import { LOBBY_KEYS, DEFAULT } from '../lobby/lobby.const';
import { UserStatsClientService } from './user-stats-client.service';
import { CurrentActions } from './player/player.interfaces';


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
    private aiOrchestrator: AiOrchestratorService,
    private userStatsClient: UserStatsClientService,
  ) { }

  /*  ATTRIBUTES  */

  // roomId -> usersIds
  private gameRooms = new Map<string, Set<string>>();
  // userId -> roomId
  private roomIdByPlayer = new Map<string, string>();

  private activePlayersByRoom = new Map<string, Set<string>>();


  /*  GAME ROOMS */

  getRoomById(userId: string) {
    return this.roomIdByPlayer.get(userId);
  }

  async verifyRoomAccess(userId: string, roomId: string): Promise<RoomAcces | null> {
    const [isActive, players, capacity] = await Promise.all([
      this.redisService.isInSet(LOBBY_KEYS.ACTIVE_ROOMS, roomId),
      this.redisService.getPlayersFromRoom(roomId),
      this.redisService.getRoomCapacity(roomId),
    ]);

    if (!isActive) {
      console.log(`[GameGateway]: Room ${roomId} not found or not active`);
      return null;
    }

    // is authorize?
    const player = players.find((p) => p.username === userId);
    if (!player) {
      console.log(`[GameGateway]: User ${userId} not authorized in room ${roomId}`);
      return null;
    }

    return { capacity, skin: player.skin };
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
    userId: string,
    uID: string,
    roomId: string,
    access: RoomAcces,
  ): Promise<void> {
    let roomPlayers = this.joinGameRoom(roomId, userId);
    this.roomIdByPlayer.set(userId, roomId);
    console.log(`Size = ${roomPlayers.size}, RoomId = ${roomId}`);

    this.playerService.initPlayer(userId, uID, access.skin);
    const player = this.playerService.getPlayer(userId)!;

    let activePlayers = this.activePlayersByRoom.get(roomId);
    if (!activePlayers) {
      activePlayers = new Set();
      this.activePlayersByRoom.set(roomId, activePlayers);
    }
    activePlayers.add(userId);

    // --- AI (feature 1, lobby-level fill) ---
    // Les bots manquants (s'il y en a) ont déjà été créés par
    // LobbyService au moment du timeout du lobby, et enregistrés à la
    // fois dans PlayerService (injectPlayer) et dans Redis
    // (room:{roomId}:bots). On les "attache" ici à cette room côté
    // GameService — pas besoin de les recréer.
    const botIds = await this.redisService.getRoomBots(roomId);
    for (const botId of botIds) {
      if (roomPlayers.has(botId)) continue; // déjà attaché par une connexion précédente
      roomPlayers.add(botId);
      // roomPlayers = this.joinGameRoom(roomId,botId);
      this.roomIdByPlayer.set(botId, roomId);
      activePlayers.add(botId);
    }
    // --- end AI ---

    console.log('Active Players at start: ', this.activePlayersByRoom);
    console.log('*********************************************');
    player.roundsRemaining = Math.log2(access.capacity);

    if (roomPlayers.size === access.capacity) {
      /////////////////////////////////* REDIS STATE : ADD ALL PLAYERS AND STATE */////////////////////////////////
      for (const uid of roomPlayers) {
        const playerState = this.playerService.getPlayer(uid)!;
        if (!playerState.isBot)
          await this.redisStateService.updateStatePlayer(uid, playerState);
      }
      /////////////////////////////////* END */////////////////////////////////
      console.log('Gameroom', this.gameRooms.get(roomId))
      this.combatService.matchmake(roomPlayers);

      // --- AI (bot-vs-bot instant resolve) ---
      // Une paire 100% bot n'a pas besoin de passer par tout le flow
      // map/team_setup/combat : personne ne regarde ce combat, on tire
      // juste un vainqueur au hasard tout de suite.
      const resolvedPairs = this.resolveBotVsBotPairs(roomId, roomPlayers);
      const playersForMapPhase =
        resolvedPairs.size > 0
          ? new Set([...roomPlayers].filter((id) => !resolvedPairs.has(id)))
          : roomPlayers;
      //if (resolvedPairs.size > 0) this.startNextRound(roomId);
      // --- end AI ---

      this.startMapPhase(roomId, playersForMapPhase);

    }
  }

  async onGodotDisconnected(userId: string, roomId: string): Promise<void> {
    const room = this.gameRooms.get(roomId);
    if (!room || !room.has(userId)) return;

    // --- AI takeover (feature 2) ---
    // Un bot ne remplace un joueur QUE s'il reste au moins un humain
    // dans la room pour qui ça a un intérêt. S'il n'en reste aucun,
    // inutile de laisser des bots jouer entre eux : on nettoie tout à
    // la place, plus bas.
    const player = this.playerService.getPlayer(userId);
    const tournamentOver = player?.status === 'winner' && player.roundsRemaining === 0;
    const stillInTheRunning = !!player && player.status !== 'loser' && !tournamentOver;

    if (stillInTheRunning) {
      const roomHasOtherHumans = this.hasHumanPlayers(roomId, userId);

      if (!roomHasOtherHumans) {
        console.log(
          `[GameService] No human players left in room ${roomId} -> deleting room instead of AI takeover`,
        );
        await this.cleanupAbandonedRoom(roomId);
        return;
      } const opponentId = this.combatService.getOpponentId(userId);
      const enemy = opponentId ? this.playerService.getPlayer(opponentId) : undefined;
      if (!enemy) {
        console.log('[GameService] enemy is undefined');
        return;
      }
      const totalRounds = Math.log2(DEFAULT.CAPACITY);
      const round = totalRounds - player.roundsRemaining + 1;

      this.aiOrchestrator.takeoverPlayer(round, totalRounds, player, enemy);
      if (player.currentPhase === 'team_choice' && !player.teamReady) {
        const chosenTeam = this.aiOrchestrator.decideBattleTeam(player, enemy);
        void this.handleMessage(player.id, { state: 'team_choice', battle_team: chosenTeam });
      } else if (player.currentPhase === 'combat') {
        this.triggerBotCombatTurn(player.id, player, enemy);
      }
      return;
    }
    // --- end AI takeover ---
    await this.cleanupEliminatedPlayer(userId, roomId);

    if (player) this.startNextRound(roomId);
    else {
      // useless with AI? 
      // safety net
      console.log('[GameService] onGodotDisconnected: AbortedGame cleaning');
      await this.deleteAbortedGame(roomId, userId);
    }
  }

  private sendToPlayer(userId: string, payload: GameMessage): void {
    //console.log("Send_to_player: id: ", userId);
    this.eventEmitter.emit('send_to_player', { userId, payload });
  }

  async startNextRound(roomId: string): Promise<void> {
    const active = this.gameRooms.get(roomId); // identical to activeRoom ? 
    if (!active) return;

    ///////////// FIX TEST INFRA ////////////
    const winners = [...active].filter( (id) => this.playerService.getPlayer(id)?.status !== 'loser');
    ////////////////////////////////////////

    const canPairEveryone = winners.length >= 2 && winners.length % 2 === 0;
    const allCombatsFinished = [...winners].every(
      (id) => this.playerService.getPlayer(id)?.duelFinished === true);

    if (allCombatsFinished && canPairEveryone) {
      console.log(
        'Active Players allCombatsFinished && canPairEveryone: ',
        active,
      );
      console.log('*********************************************');

      ////////////////FIX TEST INFRA ////////////////
      for (const id of winners) {
        this.playerService.getPlayer(id)?.resetAfterRound();
      }
      /////////////////////////////////////////////

      this.combatService.matchmake(new Set(winners));
      this.startMapPhase(roomId, new Set(winners), true);
    } else if (active.size === 1) {
      const winnerId = [...active][0];
      if (winnerId) {
        //const player = this.playerService.getPlayer(winnerId);
        await this.deleteEndGame(roomId, winnerId);
      }
      console.log('Game rooms end game: ', this.gameRooms);
      return;
    } else if (allCombatsFinished && winners.length % 2 !== 0 && winners.length  > 1) {
    // Filet de sécurité : nombre impair de joueurs actifs (≠ 1), tous
    // ont fini leur duel, donc impossible de les repairer 2 par 2. Ne
    // devrait jamais arriver en théorie -> signe d'un joueur non
    // retiré correctement ailleurs. Sans ce cas, la room reste
    // bloquée indéfiniment en "Ongoing" (voir bug room fantôme).
      console.log(
        `[GameService] startNextRound: état incohérent, ${active.size} joueurs actifs (impair) dans room ${roomId} -> nettoyage forcé`,
      );
      await this.cleanupAbandonedRoom(roomId);
    }
  }

  /* Cleaning */

  private async eliminatePlayer(userId: string, roomId: string): Promise<void> {
    console.log(
      `[GameService] Eliminating player ${userId} from room ${roomId}`,
    );
    const player = this.playerService.getPlayer(userId);
    if (player?.isBot) {
      await this.onGodotDisconnected(userId, roomId);
      return;
    }
    this.eventEmitter.emit('close_player_socket', { userId });
  }

  // Big cleaning -> see with IA
  // private async deleteAbortedGame(roomId: string, disconnectedUserId: string): Promise<void> {
  //   const remaining = this.gameRooms.get(roomId);
  //   const allInvolved = new Set(remaining ?? []);
  //   allInvolved.add(disconnectedUserId);

  //   for (const id of allInvolved) {
  //     const combatRoomId = this.combatService.playerCombatRoom.get(id);
  //     if (combatRoomId) {
  //       this.combatService.combatRooms.delete(combatRoomId);
  //       this.clearPendingBotAction(id); // FOR AVOID LEAKS
  //       this.phaseTimer.clear(`combat: ${combatRoomId}`);
  //     }
  //     this.combatService.playerCombatRoom.delete(id);
  //     this.roomIdByPlayer.delete(id);
  //     if (id !== disconnectedUserId)
  //       this.eventEmitter.emit('close_player_socket', { userId: id });
  //     const player = this.playerService.getPlayer(id);

  //     /////////////////////////////////* REDIS STATE : REMOVE PLAYER */////////////////////////////////
  //     console.log("ABORTED GAME");
  //     if (player && !player.isBot) {
  //       const playerState = await this.redisStateService.getStatePlayer(id);
  //       if (playerState) {
  //         const monsterCatch = playerState.monsterCatch;
  //         const win = playerState.win;
  //         const lose = playerState.lose;
  //         const playerDefeated = playerState.playerDefeated;
  //         const asset = playerState.asset;
  //         console.log("monsterCatch: ", monsterCatch, "win: ", win, "lose: ", lose, "playerDefeated: ", playerDefeated, "asset: ", asset);
  //         await this.userStatsClient.allUpdate(playerState.uid, { monsterCatch, win, lose, playerDefeated, asset });
  //       }
  //       await this.redisStateService.removePlayer(id);
  //     }
  //     /////////////////////////////////* END */////////////////////////////////
  //   }
  //   this.combatService.playerCombatRoom.delete(disconnectedUserId);
  //   this.roomIdByPlayer.delete(disconnectedUserId);

  //   this.phaseTimer.clear(`game: ${roomId}`);

  //   this.gameRooms.delete(roomId);
  //   this.activePlayersByRoom.delete(roomId);
  // }

  private async deleteEndGame(roomId: string, winnerId: string): Promise<void> {
    this.phaseTimer.clear(`game: ${roomId}`);
    this.gameRooms.delete(roomId);
    this.activePlayersByRoom.delete(roomId);
    this.roomIdByPlayer.delete(winnerId);
    this.combatService.playerCombatRoom.delete(winnerId);

    console.log("ENDGAME");

    /////////////////////////////////* REDIS STATE : REMOVE PLAYER */////////////////////////////////
    const playerState = await this.redisStateService.getStatePlayer(winnerId);
    if (playerState && !playerState.isBot) {
      if (playerState) {
        const monsterCatch = playerState.monsterCatch;
        const win = playerState.win;
        const lose = playerState.lose;
        const playerDefeated = playerState.playerDefeated;
        const asset = playerState.asset;
        console.log("monsterCatch: ", monsterCatch, "win: ", win, "lose: ", lose, "playerDefeated: ", playerDefeated, "asset: ", asset);
        await this.userStatsClient.allUpdate(playerState.uid, { monsterCatch, win, lose, playerDefeated, asset });
      }
      await this.redisStateService.removePlayer(winnerId);
    }
    /////////////////////////////////* END */////////////////////////////////

    Promise.all([
      this.redisStateService.removePlayer(winnerId),
      this.redisService.deleteRoom(roomId),
      this.redisService.removeActiveRoom(roomId),
    ]).catch((err) =>
      console.log([`GameService] deleteRoom: failed cleaning of ${roomId}`]),
    );
  }


  private async deleteAbortedGame(roomId: string, disconnectedUserId: string): Promise<void> {
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
    this.clearPendingBotAction(id); // FOR AVOID LEAKS
    this.roomIdByPlayer.delete(id);
    if (id !== disconnectedUserId)
      this.eventEmitter.emit('close_player_socket', { userId: id });
    const player = this.playerService.getPlayer(id);

    /////////////////////////////////* REDIS STATE : REMOVE PLAYER */////////////////////////////////
    console.log("ABORTED GAME");
    if (player && !player.isBot) {
      const playerState = await this.redisStateService.getStatePlayer(id);
      if (playerState) {
        const monsterCatch = playerState.monsterCatch;
        const win = playerState.win;
        const lose = playerState.lose;
        const playerDefeated = playerState.playerDefeated;
        const asset = playerState.asset;
        console.log("monsterCatch: ", monsterCatch, "win: ", win, "lose: ", lose, "playerDefeated: ", playerDefeated, "asset: ", asset);
        await this.userStatsClient.allUpdate(playerState.uid, { monsterCatch, win, lose, playerDefeated, asset });
      }
      await this.redisStateService.removePlayer(id);
    }
    /////////////////////////////////* END */////////////////////////////////
    this.playerService.removePlayer(id); // FOR AVOID LEAKS
  }
  this.combatService.playerCombatRoom.delete(disconnectedUserId);
  this.roomIdByPlayer.delete(disconnectedUserId);

  this.phaseTimer.clear(`game: ${roomId}`);

  this.gameRooms.delete(roomId);
  this.activePlayersByRoom.delete(roomId);

  await Promise.all([ // FOR AVOID LEAKS
    this.redisService.deleteRoom(roomId),
    this.redisService.removeActiveRoom(roomId),
  ]).catch((err) =>
    console.log(`[GameService] deleteAbortedGame: failed cleaning redis for ${roomId}`, err),
  );
}
  /* Start Phases */

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

    payloads.forEach(({ userId, payload }) => {
      const player = this.playerService.getPlayer(userId);
      if (player) {
	this.playerService.getPlayer(userId).currentPhase = 'map';
      }
      else {
	  console.log('[Start Map Phase] Player undefined')
      }
      console.log(`${this.playerService.getPlayer(userId)!.id}: CURRENT PHASE -> ${this.playerService.getPlayer(userId)!.currentPhase}`);
      this.sendToPlayer(userId, payload);
    });
    console.log(
      `[GameService]: startMapPhase -> start_game sent to ${roomPlayers.size} players of ${roomId}`,
    );
  }

  // private startTeamSetupPhase(roomId: string, roomPlayers: Set<string>) {
  //   this.phaseTimer.start(`game: ${roomId}`, 'team_setup', () => {
  //     console.log(`Room ${roomId} team_setup phase timeout`);
  //   });
  //   const teamSetupTimer =
  //     this.phaseTimer.startTimes.get(`game: ${roomId}`)! +
  //     PHASE_DURATIONS.team_setup;

    
  //   const totalRounds = Math.log2(DEFAULT.CAPACITY);
  //   for (const userId of roomPlayers) {
  //     const player = this.playerService.getPlayer(userId)!;
  //     player.currentPhase = 'team_choice';
  //     player.timer = teamSetupTimer;
  //     player.teamReady = false;

  //     console.log(`${player.id}: CURRENT PHASE -> ${player.currentPhase}`);

  //     const opponentId = this.combatService.getOpponentId(userId);
  //     const enemy = opponentId
  //       ? this.playerService.getPlayer(opponentId)
  //       : undefined;
  //     if (!enemy) {
  //       console.log(
  //         `[GameService]: No opponent for ${userId} (room ${roomId}) - using player as placeholder`,
  //       );
  //     }
  //     this.sendToPlayer(
  //       userId,
  //       this.mapService.team_setup(player, enemy ?? player),
  //     );
  //     // --- AI team_setup (feature 4a) ---
  //     // Un bot ne peut pas répondre lui-même à ce payload (pas de
  //     // websocket), donc on déclenche sa décision tout de suite en
  //     // rappelant handleMessage exactement comme si le message venait
  //     // du client — aucune logique dupliquée.
  //     if (player.isBot) {
  //       const round = totalRounds - player.roundsRemaining + 1;
  //       this.aiOrchestrator.refreshBotForRound(player, round, totalRounds);
  //       const chosenTeam = this.aiOrchestrator.decideBattleTeam(player, enemy ?? player);
  //       void this.handleMessage(userId, { state: 'team_choice', battle_team: chosenTeam });
  //     }
  //     // --- end AI team_setup ---
  //   }
  // }

  private async startTeamSetupPhase(roomId: string, roomPlayers: Set<string>) {
  this.phaseTimer.start(`game: ${roomId}`, 'team_setup', () => {
    console.log(`Room ${roomId} team_setup phase timeout`);
  });
  const teamSetupTimer =
    this.phaseTimer.startTimes.get(`game: ${roomId}`)! +
    PHASE_DURATIONS.team_setup;

  const totalRounds = Math.log2(DEFAULT.CAPACITY);

  // --- Pass 1 : init phase/timer pour tout le monde ---
  for (const userId of roomPlayers) {
    const player = this.playerService.getPlayer(userId)!;
    if (player) {
	player.currentPhase = 'team_choice';
	player.timer = teamSetupTimer;
	player.teamReady = false;
    }
    else {
	console.log('[Start Team Setup] Player undefined')
    }
  }

  // --- Pass 2 : les bots choisissent (et appliquent) leur équipe AVANT tout envoi ---
  for (const userId of roomPlayers) {
    const player = this.playerService.getPlayer(userId)!;
    if (!player.isBot) continue;

    const opponentId = this.combatService.getOpponentId(userId);
    const enemy = opponentId ? this.playerService.getPlayer(opponentId) : undefined;

    const round = totalRounds - player.roundsRemaining + 1;
    this.aiOrchestrator.refreshBotForRound(player, round, totalRounds);
    const chosenTeam = this.aiOrchestrator.decideBattleTeam(player, enemy ?? player);

    // IMPORTANT : on attend que la battle_team soit vraiment appliquée
    // avant de passer au pass 3, sinon on retombe dans le même bug.
    await this.handleMessage(userId, { state: 'team_choice', battle_team: chosenTeam });
  }

  // --- Pass 3 : on envoie team_setup à TOUT LE MONDE, une fois les bots à jour ---
  for (const userId of roomPlayers) {
    const player = this.playerService.getPlayer(userId)!;
    console.log(`${player.id}: CURRENT PHASE -> ${player.currentPhase}`);

    const opponentId = this.combatService.getOpponentId(userId);
    const enemy = opponentId ? this.playerService.getPlayer(opponentId) : undefined;
    if (!enemy) {
      console.log(
        `[GameService]: No opponent for ${userId} (room ${roomId}) - using player as placeholder`,
      );
    }
    this.sendToPlayer(userId, this.mapService.team_setup(player, enemy ?? player));
  }
}

  private startCombatPhase(roomId: string, roomPlayers: Set<string>) {
    const handled = new Set<string>();

    for (const userId of roomPlayers) {
      if (handled.has(userId)) continue;

      const opponentId = this.combatService.getOpponentId(userId);
      const combatRoomId = this.combatService.playerCombatRoom.get(userId);
      if (!combatRoomId || !opponentId) {
        console.log(
          `[GameService]: start CombatPhase -> missing combatRoomId or opponent for ${userId}`,
        );
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

      const player = this.playerService.getPlayer(userId)!;
      player.currentPhase = 'combat';
      player.timer = combatTimer;
      handled.add(userId);

      const player2 = this.playerService.getPlayer(opponentId)!;
      player2.currentPhase = 'combat';
      player2.timer = combatTimer;
      handled.add(opponentId);
      console.log(`${player.id}: CURRENT PHASE -> ${player.currentPhase}`);
      console.log(`${player2.id}: CURRENT PHASE -> ${player2.currentPhase}`);
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
      console.log(
        `[GameService] actionTimeout -> unknow combat room ${combatRoomId}`,
      );
      return;
    }

    const [userId, userId2] = room;
    const player = this.playerService.getPlayer(userId);
    const player2 = this.playerService.getPlayer(userId2);
    if (!player || !player2) {
      console.log(
        `[GameService]: actionTimeout -> missing player(s) for room ${combatRoomId}`,
      );
      return;
    }

    const forcedMonster =
      player.forceChooseMonster || player2.forceChooseMonster;
    if (forcedMonster) {
      if (
        player.forceChooseMonster &&
        player.currentActions.actionType === undefined
      ) {
        this.autoChooseMonster(userId, player);
      }
      if (
        player2.forceChooseMonster &&
        player2.currentActions.actionType === undefined
      ) {
        this.autoChooseMonster(userId2, player2);
      }
    } else {
      if (player.currentActions.actionType === undefined) {
        if (this.needMonsterChoice(player))
          this.autoChooseMonster(userId, player);
        else this.autoPass(userId, player);
      }
      if (player2.currentActions.actionType === undefined) {
        if (this.needMonsterChoice(player2))
          this.autoChooseMonster(userId2, player2);
        else this.autoPass(userId2, player2);
      }
      if (player.double_auto_pass >= 3 && player2.double_auto_pass >= 3) {
        this.resolveDoubleAutoPassDeadlock(player, player2, combatRoomId);
        return;
      }
    }

    this.resolveTurn(player, player2);
  }

  private async resolveDoubleAutoPassDeadlock(
    player: Player,
    player2: Player,
    combatRoomId: string,
  ): Promise<void> {
    console.log(
      `[GameService]: Double auto-pass deadlock -> forcing a winner (room ${combatRoomId})`,
    );

    this.applyBattleRound(player, player2, player.id, player2.id);

    const [koPlayer, otherPlayer] = this.pickDeadlockLoser(player, player2);
    const roomId = this.roomIdByPlayer.get(koPlayer.id);

    koPlayer.status = 'loser';
    otherPlayer.status = 'winner';
    koPlayer.roundsRemaining -= 1;
    otherPlayer.roundsRemaining -= 1;

    this.sendToPlayer(
      player.id,
      this.combatService.result_battle(player, otherPlayer.id),
    );
    this.sendToPlayer(
      player2.id,
      this.combatService.result_battle(player2, otherPlayer.id),
    );

    await this.finalizeBattleEnd(player, player2, combatRoomId);

    otherPlayer.duelFinished = true;
    otherPlayer.double_auto_pass = 0;

    if (!roomId) {
      console.log(
        `[GameService]: resolveDoubleAutoPassDeadlock -> roomId not found for ${koPlayer.id}`,
      );
      return;
    }

    await new Promise<void>((resolve) => setTimeout(resolve, 5000));
    await this.cleanupEliminatedPlayer(koPlayer.id, roomId);

    await this.startNextRound(roomId);


    if (!koPlayer.isBot) {
      setTimeout(() => {
        this.eventEmitter.emit('close_player_socket', { userId: koPlayer.id });
      }, 5000);
    }
  }
  
  private pickDeadlockLoser(
    player: Player,
    player2: Player,
  ): [Player, Player] {
    const validCount1 = this.countValidMonsters(player);
    const validCount2 = this.countValidMonsters(player2);

    if (validCount1 !== validCount2) {
      return validCount1 < validCount2 ? [player, player2] : [player2, player];
    }

    const life1 = player.currentMonster.life.current;
    const life2 = player2.currentMonster.life.current;

    if (life1 !== life2) {
      return life1 < life2 ? [player, player2] : [player2, player];
    }

    return Math.random() < 0.5 ? [player, player2] : [player2, player];
  }

  private countValidMonsters(player: Player): number {
    let count = 0;
    for (const monster of player.battle_team) {
      if (monster.name !== '' && monster.life.current > 0) count++;
    }
    return count;
  }

  private needMonsterChoice(player: Player): boolean {
    return (
      player.currentMonster.name === '' ||
      player.currentMonster.life.current <= 0
    );
  }

  private autoChooseMonster(userId: string, player: Player): void {
    if (player.currentActions.actionType !== undefined) return;
    console.log(
      `[GameService]: Auto-choose monster for player ${userId} (timeout)`,
    );
    player.currentActions = {
      actionType: 'change_current_monster',
      data: { slot: -1, state: 'change_current_monster' },
    };
  }

  private autoPass(userId: string, player: Player): void {
    if (player.currentActions.actionType !== undefined) return;

    console.log(`[GameService]: Auto-pass for player ${userId} (timeout)`);
    player.currentActions = {
      actionType: 'pass',
      data: { state: 'pass' },
    };
    player.double_auto_pass += 1;
  }

  private has_valid_monsters(player: Player): boolean {
    for (const monster of player.battle_team) {
      if (monster.name !== '' && monster.life.current > 0) {
        return true;
      }
    }
    return false;
  }

  /* HANDLE MESSAGE */

  async handleMessage(userId: string, payload: GameData): Promise<void> {
    const player = this.playerService.getPlayer(userId)!;
    if (!player) {
      console.log(`[GameService]: handleMessage -> unknown/already removed player ${userId}, ignoring`);
      return;
    }
    const userId2 = this.combatService.getOpponentId(userId);
    const roomId = this.roomIdByPlayer.get(userId)!;
    const state = payload?.state;
    console.log('STATE', state);

    if (state === 'safe_to_continue') {

      if (player.status === 'winner' && player.roundsRemaining > 0) {
        player.duelFinished = true;
        await this.startNextRound(roomId);
        return;
      }

      await new Promise<void>((resolve) => setTimeout(resolve, 5000));

      if (player.status === 'loser')
        await this.eliminatePlayer(player.id, roomId);
      if (player.status === 'winner' && player.roundsRemaining === 0)
        this.eventEmitter.emit('close_player_socket', { userId: player.id });
      return;
    }

    if (!userId2) {
      console.log(`[GameService]: userId2 for ${userId} is missing`);
      return;
    }

    const player2 = userId2 ? this.playerService.getPlayer(userId2) : undefined;

    if (!player2) {
      console.log(`[GameService]: No opponent for ${userId}`);
      return;
    }

    let result: GameMessage | undefined;
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
        result = await this.resolveTeamChoice(player, player2, roomId, payload);
        break;
      }
      case 'change_current_monster':
      case 'use_item_combat':
      case 'try_attack':
      case 'pass':
        this.applyPlayerAction(player, payload);
        this.resolveTurn(player, player2);
        break;
      default:
        console.log('Unknow state:', state);
    }
    if (result) this.sendToPlayer(userId, result);
    
    const playerState = this.playerService.getPlayer(userId);

    if (playerState)
      await this.redisStateService.updateStatePlayer(userId, playerState);
  }

  private async resolveTeamChoice (player: Player, player2: Player, roomId: string, payload: GameData): Promise<GameMessage | undefined> {
    let result: GameMessage | undefined;
    const error = await this.mapService.received_team_choice(
      player,
      payload.battle_team,
    );
    if (error) {
      console.log('TEAM CHOICE PAYLOAD ERROR', error);
      result = error;
      return;
    }
    player.teamReady = true;

    if (player2.teamReady) {
      this.startCombatPhase(roomId, new Set([player.id, player2.id]));
      this.sendToPlayer(player.id, this.mapService.combat(player));
      this.sendToPlayer(player2.id, this.mapService.combat(player2));
      // --- AI combat ---
      this.triggerBotCombatTurn(player.id, player, player2);
      this.triggerBotCombatTurn(player2.id, player2, player);
      // --- end AI combat ---
    }

    if (!result)
      result = { event: 'game', data: { state: 'waiting_for_opponent' } };
    return;
  }

  private applyPlayerAction(player: Player, payload: GameData): void {
    player.currentActions = {
      actionType: payload.state as CurrentActions['actionType'],
      data: payload,
    };

    if (payload.state !== 'pass') {}
    player.double_auto_pass = 0;
  }

  private resolveTurn(player: Player, player2: Player): void {
    const combatRoomId = this.combatService.playerCombatRoom.get(player.id);
    if (!combatRoomId) {
      console.log(
        `[GameService]: Missing combat room at end of combat, userId=${player.id}`,
        player.id,
      );
      return;
    }

    let playerForce: Player | undefined = undefined;
    if (player.forceChooseMonster) playerForce = player;
    else if (player2?.forceChooseMonster) playerForce = player2;

    const bothPlayersActed =
      !!player.currentActions.actionType && !!player2.currentActions.actionType;
    if (!bothPlayersActed && !playerForce?.forceChooseMonster) return;

    const roundResolved = this.applyBattleRound(
      player,
      player2,
      player.id,
      player2.id,
    );
    if (!roundResolved) return; // waiting on opponent't result;

    let endOfBattle: boolean;
    if (player.currentMonster.life.current <= 0) {
      endOfBattle = this.resolveMonsterKO(
        player,
        player2,
        /* KO */ player,
        player2,
      );
    } else if (player2.currentMonster.life.current <= 0) {
      endOfBattle = this.resolveMonsterKO(
        player,
        player2,
        /* KO */ player2,
        player,
      );
    } else {
      endOfBattle = false;
      this.startNewTurn(combatRoomId, new Set([player.id, player2.id]));
      this.sendToPlayer(player.id, this.combatService.new_turn(player));
      this.sendToPlayer(player2.id, this.combatService.new_turn(player2));
      // --- AI combat ---
      this.triggerBotCombatTurn(player.id, player, player2);
      this.triggerBotCombatTurn(player2.id, player2, player);
      // --- end AI combat ---

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
        player.id,
        this.combatService.result_battle(player, otherPlayer.id),
      );
      this.sendToPlayer(
        player2.id,
        this.combatService.result_battle(player2, otherPlayer.id),
      );

      // --- AI combat ---
      const koUserId = koPlayer.id === player.id ? player.id : player2.id;
      this.triggerBotCombatTurn(koUserId, koPlayer, otherPlayer);
      // --- end AI combat ---

      return true;
    }

    koPlayer.forceChooseMonster = true;
    player.timer = -1;

    // AutoChooseMonster case
    const combatRoomId = this.combatService.playerCombatRoom.get(player.id);
    if (combatRoomId) {
      this.startNewTurn(combatRoomId, new Set([player.id, player2.id]));
      // this.sendToPlayer(userId, this.combatService.new_turn(player));
      // this.sendToPlayer(userId, this.combatService.new_turn(player));
    } else {
      console.log(
        `[GameService]: resolveMonsterKO -> missing combatRoomIdfor ${player.id}`,
      );
    }

    this.sendToPlayer(
      player.id,
      this.combatService.change_monster(player, koPlayer.id),
    );
    this.sendToPlayer(
      player2.id,
      this.combatService.change_monster(player2, koPlayer.id),
    );

    // --- AI combat ---
    const koUserId = koPlayer.id === player.id ? player.id : player2.id;
    this.triggerBotCombatTurn(koUserId, koPlayer, otherPlayer);
    // --- end AI combat ---

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

    // --- AI combat ---
    this.clearPendingBotAction(winner.id);
    this.clearPendingBotAction(loser.id);
    // --- end AI combat ---

    // WINNER SCENE -END OF GAME
    if (winner.roundsRemaining === 0) {
      winner.win = true;
      this.sendToPlayer(winner.id, {
      event: 'game',
      data: { state: 'finish' },
      });
    }

    await this.redisStateService.updateStatePlayer(loser.id, loser);
    await this.redisStateService.updateStatePlayer(winner.id, winner);

    // reinitialize winner
   // winner.resetAfterRound();
    if (winner.isBot) winner.duelFinished = true;
    
    //loser.duelFinished = true;

    if (loser.isBot) {
      const loserBotRoomId = this.roomIdByPlayer.get(loser.id);
      if (loserBotRoomId) {
        this.eliminatePlayer(loser.id, loserBotRoomId).catch((err) =>
          console.log(`[GameService] eliminatePlayer (bot loser) failed for ${loser.id}`, err),
        )
      }
    }


    // --- AI (bot loser cleanup) ---
    // Un joueur humain qui perd déclenche sa propre élimination via
    // safe_to_continue -> onGodotDisconnected (côté client, qui se
    // déconnecte). Un bot n'a pas de websocket pour faire ça lui-même :
    // sans ce bloc, un bot qui perd face à un humain reste compté
    // indéfiniment dans gameRooms/activePlayersByRoom, et le round
    // suivant ne se déclenche jamais (allCombatsFinished ne devient
    // jamais vrai).
    // const roomId = this.roomIdByPlayer.get(winner.id);
    // if (roomId) {
    //   this.leaveGameRoom(roomId, loser.id);
    //   this.activePlayersByRoom.get(roomId)?.delete(loser.id);
    //   this.roomIdByPlayer.delete(loser.id);
    //   this.playerService.removePlayer(loser.id);
    //   this.startNextRound(roomId);
    // }
    // --- end AI ---
  }

  private async cleanupEliminatedPlayer(userId: string, roomId: string): Promise<void> {
    const player = this.playerService.getPlayer(userId);

    /////////////////////////////////* REDIS STATE : REMOVE PLAYER */////////////////////////////////
    if (!player?.isBot) {
      const playerState = await this.redisStateService.getStatePlayer(userId);
      if (playerState) {
        const monsterCatch = playerState.monsterCatch;
        const win = playerState.win;
        const lose = playerState.lose;
        const playerDefeated = playerState.playerDefeated;
        const asset = playerState.asset;
        console.log("monsterCatch: ", monsterCatch, "win: ", win, "lose: ", lose, "playerDefeated: ", playerDefeated, "asset: ", asset);
        await this.userStatsClient.allUpdate(playerState.uid, { monsterCatch, win, lose, playerDefeated, asset });
      }
      await this.redisStateService.removePlayer(userId);
    }
    /////////////////////////////////* END */////////////////////////////////

    this.leaveGameRoom(roomId, userId);
    this.activePlayersByRoom.get(roomId)?.delete(userId);
    this.roomIdByPlayer.delete(userId);
    this.playerService.removePlayer(userId);
  }

  /* AI Function */

  // userId (bot) -> timer de sa prochaine action programmée
  private pendingBotActions = new Map<string, NodeJS.Timeout>();

  /**
   * Détecte les paires 100% bot juste après le matchmake, et les
   * résout instantanément avec un vainqueur tiré au hasard, au lieu de
   * les faire passer par tout le flow map/team_setup/combat (personne
   * ne regarde un combat bot-vs-bot, autant ne pas le simuler).
   *
   * Le perdant est éliminé exactement comme un vrai joueur qui perd
   * (retiré de gameRooms/activePlayersByRoom/roomIdByPlayer/
   * PlayerService). Le vainqueur reste actif pour le round suivant,
   * mais ne participe pas à la phase map/combat de CE round.
   *
   * Retourne l'ensemble des userId déjà résolus ici (vainqueurs +
   * perdants), pour que l'appelant les exclue de roomPlayers avant de
   * démarrer startMapPhase.
   */
  private resolveBotVsBotPairs(roomId: string, roomPlayers: Set<string>): Set<string> {
    const handled = new Set<string>();
    const resolved = new Set<string>();

    for (const userId of roomPlayers) {
      if (handled.has(userId)) continue;

      const player = this.playerService.getPlayer(userId);
      if (!player?.isBot) continue;

      const opponentId = this.combatService.getOpponentId(userId);
      if (!opponentId || !roomPlayers.has(opponentId)) continue;

      const opponent = this.playerService.getPlayer(opponentId);
      if (!opponent?.isBot) continue; // au moins un humain dans la paire -> flow normal

      handled.add(userId);
      handled.add(opponentId);

      const winner = Math.random() < 0.5 ? player : opponent;
      const loser = winner === player ? opponent : player;

      console.log(
        `[GameService] Bot-vs-bot ${userId} vs ${opponentId} -> résolu instantanément, vainqueur: ${winner.id}`,
      );

      winner.status = 'winner';
      loser.status = 'loser';
      winner.roundsRemaining -= 1;
      loser.roundsRemaining -= 1;
      winner.resetAfterRound(); // même nettoyage qu'un vrai vainqueur (currentMonster/battle_team vidés)
      winner.duelFinished = true;

      // Annule la paire de combat que matchmake() venait de créer pour eux.
      const combatRoomId = this.combatService.playerCombatRoom.get(userId);
      if (combatRoomId) {
        this.combatService.combatRooms.delete(combatRoomId);
      }
      this.combatService.playerCombatRoom.delete(userId);
      this.combatService.playerCombatRoom.delete(opponentId);

      // Le perdant est éliminé, exactement comme un vrai départ.
      this.leaveGameRoom(roomId, loser.id);
      this.activePlayersByRoom.get(roomId)?.delete(loser.id);
      this.roomIdByPlayer.delete(loser.id);
      this.playerService.removePlayer(loser.id);
      this.redisStateService.removePlayer(loser.id)

      resolved.add(userId);
      resolved.add(opponentId);
    }

    return resolved;
  }

  /**
   * Est-ce qu'il reste au moins un joueur humain (pas un bot) dans cette
   * room, en excluant `excludingUserId` (typiquement celui qui vient de
   * se déconnecter et qu'on ne veut pas compter).
   */
  private hasHumanPlayers(roomId: string, excludingUserId?: string): boolean {
    const roomPlayers = this.gameRooms.get(roomId);
    if (!roomPlayers) return false;

    for (const id of roomPlayers) {
      if (id === excludingUserId) continue;
      const player = this.playerService.getPlayer(id);
      if (player && !player.isBot) return true;
    }
    return false;
  }

  /**
   * Supprime entièrement une room qui n'a plus aucun joueur humain
   * (uniquement des bots restants). Contrairement à deleteEndGame
   * (utilisée pour une fin de tournoi normale avec un vainqueur), on
   * nettoie ici TOUS les joueurs de la room, humains ou bots.
   */
  private async cleanupAbandonedRoom(roomId: string): Promise<void> {
    const roomPlayers = this.gameRooms.get(roomId);
    const userIds = roomPlayers ? [...roomPlayers] : [];

    // Cancel any timer tied to this room, so a leftover callback can't
    // fire later and try to act on a room that no longer exists.
    this.phaseTimer.clear(`game: ${roomId}`);

    for (const id of userIds) {
      // Also cancel a pending combat timer / pairing this player was part of.
      const combatRoomId = this.combatService.playerCombatRoom.get(id);
      if (combatRoomId) {
        this.phaseTimer.clear(`combat: ${combatRoomId}`);
        this.combatService.combatRooms.delete(combatRoomId);
      }
      this.combatService.playerCombatRoom.delete(id);
      this.clearPendingBotAction(id); // idem pour un éventuel timer de décision IA en attente

      await this.redisStateService.removePlayer(id.toString());
      this.playerService.removePlayer(id);
      this.roomIdByPlayer.delete(id);
    }
    

    this.gameRooms.delete(roomId);
    this.activePlayersByRoom.delete(roomId);

    await Promise.all([
      this.redisService.deleteRoom(roomId),
      this.redisService.removeActiveRoom(roomId),
    ]).catch((err) =>
      console.log(`[GameService] cleanupAbandonedRoom: failed cleaning of ${roomId}`, err),
    );

    console.log(`[GameService] Room ${roomId} abandoned (no human players left) -> deleted`);
  }

  /**
   * Annule un timer de bot en attente, s'il y en a un. À appeler aussi
   * bien avant de reprogrammer (triggerBotCombatTurn) qu'à la fin d'un
   * combat / suppression de room, pour ne jamais laisser un timer
   * fantôme se déclencher plus tard sur un état déjà terminé.
   */
  private clearPendingBotAction(userId: string): void {
    const existing = this.pendingBotActions.get(userId);
    if (existing) {
      clearTimeout(existing);
      this.pendingBotActions.delete(userId);
    }
  }

  /**
   * Si le joueur est un bot, déclenche sa décision de combat pour ce
   * tour, après un petit délai (1.5s au lieu d'un queueMicrotask quasi
   * instantané) : le client Godot a besoin d'un peu de temps pour
   * charger/transitionner la scène de combat avant de recevoir la mise
   * à jour du monstre.
   *
   * Important : on annule d'abord tout timer déjà programmé pour ce
   * bot. Sans ça, en combat bot-vs-bot (pas de rythme humain pour
   * naturellement espacer les tours), un ancien timer laissé en
   * attente peut se déclencher en retard sur le mauvais tour et
   * désynchroniser le combat.
   */
  private triggerBotCombatTurn(userId: string, player: Player, enemy: Player): void {
    if (!player.isBot) return;

    this.clearPendingBotAction(userId);

    const timer = setTimeout(() => {
      this.pendingBotActions.delete(userId);
      const action = this.aiOrchestrator.decideCombatAction(player, enemy);
      void this.handleMessage(userId, action);
    }, 500);

    this.pendingBotActions.set(userId, timer);
  }
}
