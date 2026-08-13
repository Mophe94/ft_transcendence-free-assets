import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws'; //!
import { clientsMap } from 'apps/game-service/src/shared/clients.map';
import { FULL } from 'apps/game-service/src/game/game.type';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RoomService {
  constructor(
    private phaseTimer: PhaseTimerService,
    private readonly redis: RedisService,
  ) {}

  private rooms = new Map<string, Set<WebSocket>>();

  async joinRoom(client: WebSocket, roomId: string): Promise<void> {
    this.rooms.get(roomId)?.add(client);
    const clientData = clientsMap.get(client);
    /* await this.redis.addPlayerToRoom(clientsMap.get(client).userId.toString(), roomId) */
    if (clientData) clientData.roomId = roomId;
  }

  /*   async createRoom(roomCapacity: number): Promise<string> {
    const id = await this.redis.getRandRoomId(); */
  // ROOMID HARDCODEE
  async createRoom(roomCapacity: number): Promise<string> {
    const id = await this.redis.createRoom();
    this.rooms.set(id, new Set());
    console.log(`Room created: ${id}`);
    return id;
  }

  findAvailableRoom(): string | null {
    for (const [roomId, clients] of this.rooms) {
      if (clients.size < FULL) return roomId;
    }
    return null;
  }

  async leaveRoom(
    client: WebSocket,
    roomId: string,
    userId: string,
  ): Promise<void> {
    const clients = this.rooms.get(roomId);
    if (!clients) return;
    clients.delete(client);
    /* await this.redis.removePlayerFromRoom(userId, roomId); */
    console.log(`Client left ${roomId}, ${clients.size} players remaining`);

    if (clients.size === 0) {
      /* await this.redis.deleteRoom(roomId); */
      //this.phaseTimer.clear(`game: ${roomId}`);
      this.rooms.delete(roomId);
      console.log(`Room ${roomId} deleted (empty)`);
    }
  }

  getRoomSize(roomId: string) {
    return this.rooms.get(roomId)?.size;
  }

  async deleteRoom(roomId: string): Promise<void> {
    await Promise.all([
      this.redis.removeActiveRoom(roomId),
      this.redis.removeInactiveRoom(roomId),
    ]);
    this.rooms.delete(roomId);
  }

  addClient(roomId: string, client: WebSocket): void {
    this.rooms.get(roomId)?.add(client);
  }

  getClients(roomId: string): Set<WebSocket> | undefined {
    return this.rooms.get(roomId);
  }

  removeClient(roomId: string, client: WebSocket): void {
    const clients = this.rooms.get(roomId);
    if (!clients) return;
    clients.delete(client);
    if (clients.size === 0) void this.deleteRoom(roomId);
  }
}
