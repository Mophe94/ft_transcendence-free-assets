import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebSocket } from 'ws';
import { randomUUID } from 'crypto';
import {
  clientsMap,
  ClientData,
} from 'apps/game-service/src/shared/clients.map';
import { FULL } from 'apps/game-service/src/game/game.type';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { RedisService } from '../redis/redis.service';
import { DEFAULT, LOBBY_KEYS, ROOM_IDS } from './lobby.const';

@Injectable()
export class LobbyService implements OnApplicationBootstrap {
  constructor(
    private roomService: RoomService,
    private eventEmitter: EventEmitter2,
    private phaseTimer: PhaseTimerService,
    private redisService: RedisService,
  ) {}

  // private rooms = new Map<string, Set<WebSocket>>();

  async onApplicationBootstrap() {
    await this.redisService.addToSet(LOBBY_KEYS.FREE_IDS, ROOM_IDS);
  }

  async joinLobby(client: WebSocket, userSub: number): Promise<void> {
    const roomId =
      this.roomService.findAvailableRoom() ??
      (await this.roomService.createRoom(DEFAULT.CAPACITY));

    this.roomService.joinRoom(client, roomId);
    await this.redisService.addPlayerToRoom(userSub.toString(), roomId);
    console.log('room id: ', roomId);

    const clients = this.roomService.getClients(roomId)!;

    console.log(
      `[LobbyService] User ${userSub} joined room ${roomId} (${clients.size}/${FULL})`,
    );

    this.eventEmitter.emit('lobby.player_joined', {
      clients,
      roomId,
      playerCount: clients.size,
    });

    if (clients.size === FULL) {
      this.eventEmitter.emit('lobby.start', { roomId, clients });
    }
  }
}
