import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebSocket } from 'ws';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { RedisService } from '../redis/redis.service';
import { DEFAULT, LOBBY_KEYS, ROOM_IDS } from './lobby.const';
import { AiOrchestratorService } from '../game/ai_service/ai.orchestrator.service';
import { PlayerService } from '../game/player/player.service';
import { RoomMutexService } from '../shared/room-mutex.service';


@Injectable()
export class LobbyService implements OnApplicationBootstrap {
  constructor(
    private roomService: RoomService,
    private eventEmitter: EventEmitter2,
    private redisService: RedisService,
    private phaseTimer: PhaseTimerService,
    private aiOrchestrator: AiOrchestratorService,
    private playerService: PlayerService,
    private roomMutex: RoomMutexService,
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
    await this.assignClientToRoom(client, userSub, roomId, username, skin);
  }

  // --- ÉTAPE 4 : point d'entrée public, verrouillé par roomId ---
  private async assignClientToRoom(
    client: WebSocket,
    userSub: string,
    roomId: string,
    username: string,
    skin: string,
  ): Promise<void> {
    await this.roomMutex.runExclusive(roomId, () =>
      this.assignClientToRoomLocked(client, userSub, roomId, username, skin),
    );
  }

  // --- ÉTAPE 4 : le corps original, renommé, exécuté SOUS verrou ---
  private async assignClientToRoomLocked(
    client: WebSocket,
    userSub: string,
    roomId: string,
    username: string,
    skin: string,
  ): Promise<void> {
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

    const evictedBotId = await this.redisService.popRoomBot(roomId);
    if (evictedBotId) {
      await this.evictBot(roomId, evictedBotId);
    }

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
      this.phaseTimer.clear(`lobby:${roomId}`);
      this.roomService.markRoomActive(roomId);
      await this.redisService.markRoomActive(roomId);
      this.eventEmitter.emit('lobby.start', { roomId, clients });
    } else if (clients.size === 1) {
      await this.redisService.setRoomTimer(roomId);

      await this.fillRemainingWithBots(
        roomId,
        roomCapacity - clients.size,
        clients,
      );

      this.phaseTimer.start(`lobby:${roomId}`, 'lobby', () => {
        console.log(`[LobbyService] Room ${roomId} lobby timeout`);
        void this.confirmRoomStart(roomId, clients);
      });
    }
  }

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

  private async evictBot(roomId: string, botId: string): Promise<void> {
    await this.redisService.removePlayerFromRoom(botId, roomId);
    this.playerService.removePlayer(botId);
    console.log(
      `[LobbyService] Bot ${botId} évincé de la room ${roomId} (remplacé par un vrai joueur)`,
    );
  }

  private async confirmRoomStart(
    roomId: string,
    clients: Set<WebSocket>,
  ): Promise<void> {
    this.roomService.markRoomActive(roomId);
    await this.redisService.markRoomActive(roomId);
    this.eventEmitter.emit('lobby.start', { roomId, clients });
  }

  private async spawnAndRegisterBots(
    roomId: string,
    count: number,
  ): Promise<void> {
    if (count <= 0) return;

    const capacity = this.roomService.getRoomCapacity(roomId);
    if (capacity === undefined) return;

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

  async leaveRoom(
    client: WebSocket,
    roomId: string,
    userId: string,
  ): Promise<void> {
    await this.roomMutex.runExclusive(roomId, async () => {
      const remainingClients = await this.roomService.leaveRoom(
        client,
        roomId,
        userId,
      );
      if (remainingClients) {
        await this.handlePlayerLeaveLocked(roomId, remainingClients);
      }
    });
  }

  private async handlePlayerLeaveLocked(
    roomId: string,
    clients: Set<WebSocket>,
  ): Promise<void> {
    const capacity = this.roomService.getRoomCapacity(roomId);
    if (capacity === undefined) return;
    if (this.roomService.isRoomActive(roomId)) return;

    await this.spawnAndRegisterBots(roomId, 1);

    this.eventEmitter.emit('lobby.player_joined', {
      clients,
      roomId,
      playerCount: capacity,
    });
  }
}