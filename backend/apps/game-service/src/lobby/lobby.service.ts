import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebSocket } from 'ws';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { RedisService } from '../redis/redis.service';
import { DEFAULT, LOBBY_KEYS, ROOM_IDS } from './lobby.const';

@Injectable()
export class LobbyService implements OnApplicationBootstrap {
  constructor(
    private roomService: RoomService,
    private eventEmitter: EventEmitter2,
    private redisService: RedisService,
    private phaseTimer: PhaseTimerService,
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
    const capacity = this.roomService.getRoomCapacity(roomId);
    const size = this.roomService.getRoomSize(roomId);

    if (capacity === undefined || size === undefined || size >= capacity) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            event: 'lobby',
            state: 'join_failed',
            data: { roomId, reason: capacity === undefined ? 'not_found' : 'full' },
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
    await this.redisService.addPlayerToRoom(userSub.toString(), roomId, username, skin);

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
      this.phaseTimer.clear(`lobby:${roomId}`);
      await this.redisService.markRoomActive(roomId);
      this.eventEmitter.emit('lobby.start', { roomId, clients });
    } else if (clients.size === 1) {
      await this.redisService.setRoomTimer(roomId);
      this.phaseTimer.start(`lobby:${roomId}`, 'lobby', () => {
        console.log(`[LobbyService] Room ${roomId} lobby timeout`);
        this.eventEmitter.emit('lobby.start', { roomId, clients });
      });
    }
  }
}