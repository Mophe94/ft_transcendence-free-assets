import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import { clientsMap } from 'apps/game-service/src/shared/clients.map';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RedisService } from '../redis/redis.service';

interface Room {
  clients: Set<WebSocket>;
  capacity: number;
  // true dès que la partie a démarré (voir markRoomActive). Une fois
  // active, la room ne doit plus jamais être proposée par
  // findAvailableRoom, même si `clients.size` redescend temporairement
  // sous `capacity` (ex: un socket /lobby resté ouvert qui se
  // déconnecte après le lancement de la partie). Sans ce flag,
  // quick_pairing pouvait router un nouveau joueur dans une game déjà
  // en cours ("Ongoing").
  active: boolean;
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
    this.rooms.set(id, {
      clients: new Set(),
      capacity: finalCapacity,
      active: false,
    });
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
      if (!room.active && room.clients.size < room.capacity) return roomId;
    }
    return null;
  }

  getRoomCapacity(roomId: string): number | undefined {
    return this.rooms.get(roomId)?.capacity;
  }

  /**
   * Marque la room comme lancée : plus jamais renvoyée par
   * findAvailableRoom, et un join_room explicite dessus doit être
   * refusé côté LobbyService (voir isRoomActive). Appelée par
   * LobbyService en même temps que redisService.markRoomActive, au
   * moment exact où la partie démarre (room pleine ou fin du timer).
   */
  markRoomActive(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room) room.active = true;
  }

  isRoomActive(roomId: string): boolean | undefined {
    return this.rooms.get(roomId)?.active;
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