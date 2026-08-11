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
//import { GamePayload } from './game.type';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { FULL, PHASE_DURATIONS} from 'apps/game-service/src/game/game.type';
//import { Skill } from './entities/skills.entity';
import { AiService } from './ai_service/ai.service';

import {
  CurrentActions,
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
    private mapService: MapService,
    private aiService: AiService,
  ) {}

  private gameRooms = new Map<string, Set<number>>();
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
    const rooms = this.joinGameRoom(roomId, userId);
    this.roomIdByPlayer.set(userId, roomId);
    console.log(`Size = ${rooms.size}, RoomId = ${roomId}`);

    if (!this.playerService.getPlayer(userId))
      this.playerService.initPlayer(userId);
    const player = this.playerService.getPlayer(userId)!;

    if (rooms.size === FULL) {
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
    } else if (rooms.size === 1) {
    this.phaseTimer.start(roomId, 'godot_fill', () => {
      console.log(`[GameService] Room ${roomId} pas remplie côté Godot -> ajout de bots`);
      this.fillRoomWithBots(roomId, rooms);
      });
    }
  }
  
  private async fillRoomWithBots(roomId: string, room: Set<number>): Promise<void> {
  const missing = FULL - room.size;

  for (let i = 0; i < missing; i++) {
    const botId = this.aiService.generateBotId();
    const bot = this.aiService.createBotPlayer('hardcoded', botId);
    // 🔍 INSPECTION DE LA TEAM DU BOT DANS TES LOGS 
    console.log(`\n================= DATA BOT ${botId} =================`);
    console.dir(bot.battle_team, { depth: null, colors: true });
    console.log(`=====================================================\n`);
    this.playerService.injectPlayer(botId, bot);
    room.add(botId);
  }

    this.combatService.matchmake(room);
    await this.startMapPhase(roomId, room);
  }

 onGodotDisconnected(userId: number, roomId: string): void {
  this.leaveGameRoom(roomId, userId);
  void this.handleTakeover(userId, roomId);
}

private async handleTakeover(userId: number, roomId: string): Promise<void> {
  const player = this.playerService.getPlayer(userId);
  if (!player || player.isBot) return; // déjà bot ou introuvable, rien à faire

  const opponentId = this.combatService.getOpponentId(userId);
  const enemy = opponentId ? this.playerService.getPlayer(opponentId) : undefined;

  this.aiService.createBotPlayer('takeover', undefined, player); // flip isBot=true, garde tout son état
  console.log(`[GameService] Joueur ${userId} déconnecté -> takeover IA`);

  if (enemy && !enemy.isBot) {
    this.sendToPlayer(enemy.id, this.opponent_takeover(player)); // ⚠️ payload à adapter, voir plus bas
  }

  // Nettoyage si la room ne contient plus que des bots (logique déjà existante)
  const room = this.gameRooms.get(roomId);
  if (room && [...room].every((id) => this.playerService.getPlayer(id)?.isBot)) {
    for (const id of room) this.playerService.removePlayer(id);
    this.gameRooms.delete(roomId);
    console.log(`[GameService] Room ${roomId} ne contenait plus que des bots -> nettoyée`);
    return;
  }

  if (!enemy) return;

  // Si le joueur n'avait pas encore validé sa battle_team, l'IA choisit à sa place
  const hasBattleTeam = player.battle_team.some((m) => m.name !== '');
  if (!hasBattleTeam) {
    const chosenNames = await this.aiService.chooseCounterTeamByNames(player.team, enemy.team);
    await this.mapService.received_team_choice(player, chosenNames);
  }
  // Si le combat est déjà en cours, on ne fait rien de plus pour l'instant —
  // volontairement laissé de côté, voir note plus bas.
}

// ⚠️ Payload à adapter à ce qu'attend ton client Godot
private opponent_takeover(player: Player) {
  return {
    event: 'game',
    data: {
      state: 'opponent_takeover',
      message: `${player.name} a été déconnecté et remplacé par une IA.`,
    },
  };
}

  private sendToPlayer(userId: number, payload: object): void {
    console.log("Send_to_player: id: ", userId, payload);
     console.log("Send_to_player: id: ", userId, JSON.stringify(payload, null, 2));
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

  private readonly BOT_DISPLAY_ID_OFFSET = 10_000_000;

// Godot ne déclenche l'affichage du monstre adverse que si change_monster >= 0.
// Les bots ont des IDs négatifs en interne, donc on les retraduit ici en un
// nombre positif, uniquement dans le payload sortant — jamais dans l'état
// interne du Player, jamais dans CombatService, jamais dans Godot.
private toClientSafePayload(payload: any): any {
  const cm = payload?.data?.change_monster;
  if (typeof cm !== 'number' || cm === -1) return payload;

  const changedPlayer = this.playerService.getPlayer(cm);
  if (changedPlayer?.isBot) {
    return {
      ...payload,
      data: { ...payload.data, change_monster: this.BOT_DISPLAY_ID_OFFSET + Math.abs(cm) },
    };
  }
  return payload;
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
      if (player.isBot && enemy) {
      this.handleBotTeamChoice(player, enemy); // 👈 déclenche le choix IA
    }

      this.sendToPlayer(userId, this.mapService.team_setup(player, enemy ?? player));
    }
  }
  
  private async handleBotTeamChoice(bot: Player, enemy: Player): Promise<void> {
    // bot.battle_team contient encore le pool de 6 à ce stade (posé par createBotPlayer)
    const chosenTeam = await this.aiService.chooseCounterTeam(bot.battle_team, enemy.team);
    bot.battle_team = chosenTeam; // 👈 écrase le pool par les 3 monstres retenus

    console.log(`\n================= BATTLE_TEAM FINAL BOT ${bot.id} =================`);
    console.dir(bot.battle_team, { depth: null, colors: true });
    console.log('=====================================================================\n');
  }

  private startCombatPhase(roomId: string, room: Set<number>) {
    this.phaseTimer.start(`game: ${roomId}`, 'choose_action', () => {
      console.log(`Room ${roomId} choose_monster timeout`);

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
      this.phaseTimer.startTimes.get(`game: ${roomId}`)! + PHASE_DURATIONS.choose_monster;

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
    let player = this.playerService.getPlayer(userId)!;
    let userId2 = this.combatService.getOpponentId(userId);
    const roomId = this.roomIdByPlayer.get(userId)!;
    
    if (!userId2) {
      console.log(`[GameService]: userId2 for ${userId} is missing - using userId as placeholder`);
      userId2 = userId;
    }
    let player2 = userId2 ? this.playerService.getPlayer(userId2) : undefined;

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
          console.log("Current actions", player.currentActions);
          if (player2.isBot) {
            player2.currentActions = this.aiService.decideAction(player2, player);
          }
          if (player.currentActions.actionType && player2.currentActions.actionType) {
            const mapResult = await this.combatService.resolving_battle_round(player, player2);
            player.currentActions.actionType = undefined;
            player2.currentActions.actionType = undefined;
            if (mapResult && mapResult.get(player.id) !== undefined && mapResult.get(player2.id) !== undefined){
              const currentMessagePlayer = mapResult.get(player.id);
              const currentMessagePlayer2 = mapResult.get(player2.id);
              console.log("* CurrentMessagePlayer1 *: ", mapResult.get(player.id));
              console.log("*************************************");
              console.log("* CurrentMessagePlayer2 *: ", mapResult.get(player2.id));
              console.log("*************************************");

              for (let i = 0; i < currentMessagePlayer!.length; ++i){
                // this.sendToPlayer(userId, currentMessagePlayer?.at(i)!);
                // this.sendToPlayer(userId2, currentMessagePlayer2?.at(i)!);
                for (let i = 0; i < currentMessagePlayer!.length; ++i){
                  this.sendToPlayer(userId, this.toClientSafePayload(currentMessagePlayer?.at(i)!));
                  this.sendToPlayer(userId2, this.toClientSafePayload(currentMessagePlayer2?.at(i)!));
                }

              }
              await new Promise(resolve => setTimeout(resolve, 2000)); // ! "temp fix to synchronizeke"

              if (player.currentMonster.life.current <= 0){
                if (!this.has_valid_monsters(player)){
                  this.sendToPlayer(userId, this.combatService.result_battle(player, player2.id));
                  this.sendToPlayer(userId2, this.combatService.result_battle(player2, player2.id));
                  // wainting all combat finish
                }
                else{
                  this.sendToPlayer(userId, this.combatService.change_monster(player, player.id));
                  this.sendToPlayer(userId2, this.combatService.change_monster(player2, player.id));
                }
              }
              else if (player2.currentMonster.life.current <= 0){
                if (!this.has_valid_monsters(player2)){
                  this.sendToPlayer(userId, this.combatService.result_battle(player, player.id));
                  this.sendToPlayer(userId2, this.combatService.result_battle(player2, player.id));
  
                }
                else{
                  this.sendToPlayer(userId, this.combatService.change_monster(player, player2.id));
                  this.sendToPlayer(userId2, this.combatService.change_monster(player2, player2.id));
                }
              }
    //					else if (!has_valid_monsters(player2)){
    //						send result_battle(player, player.id)
    //						send result_battle(player2, player.id)
    //					}
              else{
                this.startNewTurn(roomId, this.gameRooms.get(roomId)!);
                this.sendToPlayer(userId, this.combatService.new_turn(player));
                this.sendToPlayer(userId2, this.combatService.new_turn(player2));
                // si un combat deja finish declenchement du roundLeft
                // send new_turn(player, rounLeft)
                // send new_turn(player, roundLeft)
              }
            }
                }
          break;
      
      default:
        console.log("Unknow state:", state)
        return undefined
    }
    return result
    }
  }
