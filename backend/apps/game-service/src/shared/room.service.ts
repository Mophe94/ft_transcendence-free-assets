import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import { clientsMap } from 'apps/game-service/src/shared/clients.map';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RedisService } from '../redis/redis.service';

interface Room {
  clients: Set<WebSocket>;
  capacity: number;
}

@Injectable()
export class RoomService {
  constructor(
    private phaseTimer: PhaseTimerService,
    private readonly redis: RedisService,
  ) {}

  private rooms = new Map<string, Room>();

  async createRoom(capacity?: number): Promise<string> {
    const id = await this.redis.createRoom(capacity);
    const finalCapacity = await this.redis.getRoomCapacity(id);
    this.rooms.set(id, { clients: new Set(), capacity: finalCapacity });
    console.log(`Room created: ${id} (capacity ${finalCapacity})`);
    return id;
  }

  async joinRoom(client: WebSocket, roomId: string): Promise<void> {
    this.rooms.get(roomId)?.clients.add(client);
    const clientData = clientsMap.get(client);
    if (clientData) {
      clientData.roomId = roomId;
    }
  }

  findAvailableRoom(): string | null {
    for (const [roomId, room] of this.rooms) {
      if (room.clients.size < room.capacity) return roomId;
    }
    return null;
  }

  getRoomCapacity(roomId: string): number | undefined {
    return this.rooms.get(roomId)?.capacity;
  }

  async leaveRoom(
    client: WebSocket,
    roomId: string,
    userId: string,
  ): Promise<Set<WebSocket> | null> {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    room.clients.delete(client);
    await this.redis.removePlayerFromRoom(userId, roomId);
    console.log(
      `Client left ${roomId}, ${room.clients.size} players remaining`,
    );

    if (room.clients.size === 0) {
      this.phaseTimer.clear(`lobby:${roomId}`);
      await this.redis.deleteRoom(roomId);
      this.rooms.delete(roomId);
      console.log(`Room ${roomId} deleted (empty)`);
      return null;
    }
    return room.clients;
  }

  getRoomSize(roomId: string): number | undefined {
    return this.rooms.get(roomId)?.clients.size;
  }

  getClients(roomId: string): Set<WebSocket> | undefined {
    return this.rooms.get(roomId)?.clients;
  }
}
