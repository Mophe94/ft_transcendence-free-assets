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
    // Check de capacité harmonisé : fait uniquement dans
    // assignClientToRoom (point d'entrée commun aux 3 boutons), pour
    // éviter toute duplication et toute fenêtre de race entre un
    // check ici et un check là-bas.
    await this.assignClientToRoom(client, userSub, roomId, username, skin);
  }

  private async assignClientToRoom(
    client: WebSocket,
    userSub: string,
    roomId: string,
    username: string,
    skin: string,
  ): Promise<void> {
    // Check unique de capacité, harmonisé pour create_room /
    // quick_pairing / join_room. Fait AVANT le premier await -> pas de
    // fenêtre de race possible (JS mono-thread, rien ne peut
    // s'intercaler entre ce check et roomService.joinRoom juste après).
    const capacity = this.roomService.getRoomCapacity(roomId);
    const size = this.roomService.getRoomSize(roomId);
    const isActive = this.roomService.isRoomActive(roomId);

    if (
      capacity === undefined ||
      size === undefined ||
      size >= capacity ||
      isActive
    ) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            event: 'lobby',
            state: 'join_failed',
            data: {
              roomId,
              reason:
                capacity === undefined
                  ? 'not_found'
                  : isActive
                    ? 'already_started'
                    : 'full',
            },
          }),
        );
      }
      return;
    }

    await this.roomService.joinRoom(client, roomId);

    // --- AI (feature 1, lobby-level fill) ---
    // Si des bots occupent déjà cette room (remplissage précédent),
    // on en évince UN pour libérer la place que ce vrai joueur va
    // prendre, afin que l'occupation totale (réels + bots) ne dépasse
    // jamais la capacité.
    //
    // popRoomBot utilise SPOP, atomique côté Redis : indispensable ici
    // car deux vrais joueurs peuvent rejoindre quasi simultanément.
    // Avec un ancien getRoomBots() + removeBotFromRoom() séparés, les
    // deux pouvaient lire le même botId avant que l'un des deux ne
    // l'ait supprimé -> un seul bot réellement évincé pour deux
    // joueurs ajoutés -> room à 5/4. SPOP garantit que chaque appel
    // concurrent retire un élément différent du set.
    const evictedBotId = await this.redisService.popRoomBot(roomId);
    if (evictedBotId) {
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
    const roomCapacity = this.roomService.getRoomCapacity(roomId)!;

    console.log(
      `[LobbyService] User ${userSub} joined room ${roomId} (${clients.size}/${roomCapacity})`,
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

    if (clients.size === roomCapacity) {
      // Tous les vrais joueurs sont là (tous les bots ont été
      // remplacés au fil des joins) : on démarre tout de suite, pas
      // besoin d'attendre la fin du timer.
      this.phaseTimer.clear(`lobby:${roomId}`);
      this.roomService.markRoomActive(roomId);
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
      await this.fillRemainingWithBots(
        roomId,
        roomCapacity - clients.size,
        clients,
      );
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

    await this.spawnAndRegisterBots(roomId, missing);

    const capacity = this.roomService.getRoomCapacity(roomId)!;
    this.eventEmitter.emit('lobby.player_joined', {
      clients,
      roomId,
      playerCount: capacity,
    });
  }

  /**
   * --- AI (feature 1, lobby-level fill) ---
   * Retire un bot d'une room : du hash des joueurs (Redis) ET de
   * PlayerService (sinon le Player du bot reste en mémoire pour rien,
   * puisqu'il n'appartient plus à aucune room). Le bot a déjà été
   * retiré du set ROOM_BOTS par popRoomBot (SPOP) avant l'appel, donc
   * pas besoin de removeBotFromRoom ici.
   */
  private async evictBot(roomId: string, botId: string): Promise<void> {
    await this.redisService.removePlayerFromRoom(botId, roomId);
    this.playerService.removePlayer(botId);
    console.log(
      `[LobbyService] Bot ${botId} évincé de la room ${roomId} (remplacé par un vrai joueur)`,
    );
  }
  // --- end AI ---

  /**
   * --- AI (feature 1, lobby-level fill) ---
   * Appelée à la fin du timer du lobby. Les bots ont déjà été ajoutés
   * dès le premier joueur (fillRemainingWithBots) : il ne reste qu'à
   * marquer la room active et lancer la partie avec ce qu'il y a
   * (mélange réels + bots restants).
   */
  private async confirmRoomStart(
    roomId: string,
    clients: Set<WebSocket>,
  ): Promise<void> {
    this.roomService.markRoomActive(roomId);
    await this.redisService.markRoomActive(roomId);
    this.eventEmitter.emit('lobby.start', { roomId, clients });
  }
  // --- end AI ---

  /**
   * --- AI (feature 1, lobby-level fill) ---
   * Crée `count` bots hardcodés et les enregistre dans Redis (players
   * + set de bots), exactement comme de vrais joueurs. Utilisée à la
   * fois pour le remplissage initial du lobby et pour remettre un bot
   * à la place d'un joueur qui quitte.
   *
   * Clampe systématiquement le nombre de bots créés à la place
   * réellement disponible dans la room (capacity - currentCount), pour
   * qu'il soit structurellement impossible de dépasser la capacité,
   * peu importe le chemin d'appel (join, leave, timeout, race, etc.).
   */
  private async spawnAndRegisterBots(
    roomId: string,
    count: number,
  ): Promise<void> {
    if (count <= 0) return;

    const capacity = this.roomService.getRoomCapacity(roomId);
    if (capacity === undefined) return; // room n'existe plus

    const currentCount = await this.redisService.countPlayersInRoom(roomId);
    const toSpawn = Math.max(0, Math.min(count, capacity - currentCount));
    if (toSpawn <= 0) {
      console.log(
        `[LobbyService] Room ${roomId} déjà à capacité (${currentCount}/${capacity}), aucun bot ajouté`,
      );
      return;
    }

    const totalRounds = Math.log2(capacity);
    const bots = await this.aiOrchestrator.spawnBotsForRoom(
      1,
      totalRounds,
      toSpawn,
    );

    for (const bot of bots) {
      // bot.asset est en casse "jeu" (Godot) ; l'écran d'attente React
      // attend une casse différente pour le même skin, donc on passe
      // par getLobbySkin plutôt que bot.asset directement.
      const lobbySkin = this.aiOrchestrator.getLobbySkin(bot);
      await this.redisService.addPlayerToRoom(
        bot.id,
        roomId,
        bot.name,
        lobbySkin,
      );
      await this.redisService.addBotToRoom(bot.id, roomId);
    }

    console.log(
      `[LobbyService] Room ${roomId} : ${bots.length} bot(s) ajouté(s)`,
    );
  }
  // --- end AI ---

  /**
   * --- AI (feature 1, lobby-level fill) ---
   * Un joueur quitte le lobby avant le lancement de la partie : on
   * remet immédiatement un bot hardcodé à sa place, pour que la
   * capacité de la room ne stagne jamais en dessous du max.
   *
   * `spawnAndRegisterBots` clampe déjà le nombre de bots créés à la
   * place disponible : si la room est déjà pleine (ex. déconnexion
   * tardive d'un socket /lobby après le lancement de la partie), rien
   * n'est ajouté et la fonction ne fait qu'un broadcast no-op.
   */
  async handlePlayerLeave(
    roomId: string,
    clients: Set<WebSocket>,
  ): Promise<void> {
    const capacity = this.roomService.getRoomCapacity(roomId);
    if (capacity === undefined) return; // room déjà supprimée
    if (this.roomService.isRoomActive(roomId)) return; // partie déjà lancée, rien à faire ici

    await this.spawnAndRegisterBots(roomId, 1);

    this.eventEmitter.emit('lobby.player_joined', {
      clients,
      roomId,
      playerCount: capacity,
    });
  }
  // --- end AI ---
}