import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebSocket } from 'ws';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { RedisService } from '../redis/redis.service';
import { DEFAULT, LOBBY_KEYS, ROOM_IDS } from './lobby.const';
// --- AI (feature 1, lobby-level fill) ---
import { AiOrchestratorService } from '../game/ai_service/ai.orchestrator.service';
import { PlayerService } from '../game/player/player.service';
// --- end AI ---

@Injectable()
export class LobbyService implements OnApplicationBootstrap {
  constructor(
    private roomService: RoomService,
    private eventEmitter: EventEmitter2,
    private redisService: RedisService,
    private phaseTimer: PhaseTimerService,
    private aiOrchestrator: AiOrchestratorService, // --- AI (feature 1) ---
    private playerService: PlayerService, // --- AI (feature 1) --- (pour évincer un bot proprement)
  ) {}

  async onApplicationBootstrap() {
    await this.redisService.addToSet(LOBBY_KEYS.FREE_IDS, ROOM_IDS);
  }

  async createRoomAndJoin(
    client: WebSocket,
    userSub: string,
    username: string,
    skin: string,
  ): Promise<void> {
    const roomId = await this.roomService.createRoom(DEFAULT.CAPACITY);
    await this.assignClientToRoom(client, userSub, roomId, username, skin);
  }

  async quickPairing(
    client: WebSocket,
    userSub: string,
    username: string,
    skin: string,
  ): Promise<void> {
    const roomId =
      this.roomService.findAvailableRoom() ??
      (await this.roomService.createRoom(DEFAULT.CAPACITY));
    await this.assignClientToRoom(client, userSub, roomId, username, skin);
  }

  async joinRoom(
    client: WebSocket,
    userSub: string,
    roomId: string,
    username: string,
    skin: string,
  ): Promise<void> {
    // Capacité vérifiée sur les VRAIS websockets uniquement (RoomService
    // ne connaît pas les bots) : c'est volontaire. Une room "pleine" de
    // bots doit rester rejoignable par un vrai joueur, qui remplacera
    // un bot (voir assignClientToRoom). On ne bloque que si elle est
    // déjà pleine de VRAIS joueurs.
    const capacity = this.roomService.getRoomCapacity(roomId);
    const size = this.roomService.getRoomSize(roomId);

    if (capacity === undefined || size === undefined || size >= capacity) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            event: 'lobby',
            state: 'join_failed',
            data: {
              roomId,
              reason: capacity === undefined ? 'not_found' : 'full',
            },
          }),
        );
      }
      return;
    }

    await this.assignClientToRoom(client, userSub, roomId, username, skin);
  }

  private async assignClientToRoom(
    client: WebSocket,
    userSub: string,
    roomId: string,
    username: string,
    skin: string,
  ): Promise<void> {
    await this.roomService.joinRoom(client, roomId);

    // --- AI (feature 1, lobby-level fill) ---
    // Si des bots occupent déjà cette room (remplissage précédent),
    // on en évince UN pour libérer la place que ce vrai joueur va
    // prendre, afin que l'occupation totale (réels + bots) ne dépasse
    // jamais la capacité.
    const roomBots = await this.redisService.getRoomBots(roomId);
    if (roomBots.length > 0) {
      const evictedBotId = roomBots[0];
      await this.evictBot(roomId, evictedBotId);
    }
    // --- end AI ---

    await this.redisService.addPlayerToRoom(
      userSub.toString(),
      roomId,
      username,
      skin,
    );

    const clients = this.roomService.getClients(roomId)!;
    const capacity = this.roomService.getRoomCapacity(roomId)!;

    console.log(
      `[LobbyService] User ${userSub} joined room ${roomId} (${clients.size}/${capacity})`,
    );

    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          event: 'lobby',
          state: 'room_assigned',
          data: { roomId },
        }),
      );
    }

    this.eventEmitter.emit('lobby.player_joined', {
      clients,
      roomId,
      playerCount: clients.size,
    });

    if (clients.size === capacity) {
      // Tous les vrais joueurs sont là (tous les bots ont été
      // remplacés au fil des joins) : on démarre tout de suite, pas
      // besoin d'attendre la fin du timer.
      this.phaseTimer.clear(`lobby:${roomId}`);
      await this.redisService.markRoomActive(roomId);
      this.eventEmitter.emit('lobby.start', { roomId, clients });
    } else if (clients.size === 1) {
      await this.redisService.setRoomTimer(roomId);

      // --- AI (feature 1, instant lobby fill) ---
      // Premier joueur de la room : on remplit TOUT DE SUITE les
      // places restantes avec des bots (nom, skin, équipe), pour que
      // le lobby affiche une room déjà "complète" dès le départ,
      // plutôt que d'attendre la fin du countdown. Si d'autres vrais
      // joueurs rejoignent ensuite, ils remplaceront un bot chacun
      // (voir plus haut dans cette même fonction).
      await this.fillRemainingWithBots(roomId, capacity - clients.size, clients);
      // --- end AI ---

      this.phaseTimer.start(`lobby:${roomId}`, 'lobby', () => {
        console.log(`[LobbyService] Room ${roomId} lobby timeout`);
        // Les bots ont déjà été ajoutés plus haut : il ne reste qu'à
        // confirmer le lancement (avec les bots restants, s'il y en a).
        void this.confirmRoomStart(roomId, clients);
      });
    }
  }

  /**
   * --- AI (feature 1, instant lobby fill) ---
   * Crée `missing` bots et les enregistre dans Redis exactement comme
   * de vrais joueurs (visibles dans le lobby dès ce broadcast).
   */
  private async fillRemainingWithBots(
    roomId: string,
    missing: number,
    clients: Set<WebSocket>,
  ): Promise<void> {
    if (missing <= 0) return;

    const capacity = this.roomService.getRoomCapacity(roomId)!;
    const totalRounds = Math.log2(capacity);
    const bots = await this.aiOrchestrator.spawnBotsForRoom(1, totalRounds, missing);

    for (const bot of bots) {
      // bot.asset est en casse "jeu" (Godot) ; l'écran d'attente React
      // attend une casse différente pour le même skin, donc on passe
      // par getLobbySkin plutôt que bot.asset directement.
      const lobbySkin = this.aiOrchestrator.getLobbySkin(bot);
      await this.redisService.addPlayerToRoom(bot.id, roomId, bot.name, lobbySkin);
      await this.redisService.addBotToRoom(bot.id, roomId);
    }

    console.log(`[LobbyService] Room ${roomId} pré-remplie avec ${bots.length} bot(s)`);

    // Room affichée comme complète (réels + bots) dès maintenant.
    this.eventEmitter.emit('lobby.player_joined', {
      clients,
      roomId,
      playerCount: capacity,
    });
  }

  /**
   * --- AI (feature 1, lobby-level fill) ---
   * Retire un bot d'une room : de Redis (players + set de bots) ET de
   * PlayerService (sinon le Player du bot reste en mémoire pour rien,
   * puisqu'il n'appartient plus à aucune room).
   */
  private async evictBot(roomId: string, botId: string): Promise<void> {
    await this.redisService.removePlayerFromRoom(botId, roomId);
    await this.redisService.removeBotFromRoom(botId, roomId);
    this.playerService.removePlayer(botId);
    console.log(`[LobbyService] Bot ${botId} évincé de la room ${roomId} (remplacé par un vrai joueur)`);
  }
  // --- end AI ---

  /**
   * --- AI (feature 1, lobby-level fill) ---
   * Appelée à la fin du timer du lobby. Les bots ont déjà été ajoutés
   * dès le premier joueur (fillRemainingWithBots) : il ne reste qu'à
   * marquer la room active et lancer la partie avec ce qu'il y a
   * (mélange réels + bots restants).
   */
  private async confirmRoomStart(roomId: string, clients: Set<WebSocket>): Promise<void> {
    await this.redisService.markRoomActive(roomId);
    this.eventEmitter.emit('lobby.start', { roomId, clients });
  }
  // --- end AI ---
}