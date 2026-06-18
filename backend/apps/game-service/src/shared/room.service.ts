import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws'; //!
import { randomUUID } from 'crypto';
import {
  clientsMap,
  ClientData,
} from 'apps/game-service/src/shared/clients.map';
import { FULL_LOBBY } from 'apps/game-service/src/game/game.type';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';

@Injectable()
export class RoomService {
  constructor(private phaseTimer: PhaseTimerService) {}

  private rooms = new Map<string, Set<WebSocket>>();

  joinRoom(client: WebSocket, roomId: string): void {
    this.rooms.get(roomId)?.add(client);
    const clientData = clientsMap.get(client);
    if (clientData) clientData.roomId = roomId;
  }

  // ROOMID HARDCODEE
  createRoom(roomId?: string): string {
    const id = roomId ?? 'test-room'; //randomUUID();
    this.rooms.set(id, new Set());
    console.log(`Room created: ${id}`);
    return id;
  }

  findAvailableRoom(): string | null {
    for (const [roomId, clients] of this.rooms) {
      if (clients.size < FULL_LOBBY) return roomId;
    }
    return null;
  }

  leaveRoom(client: WebSocket, roomId: string): void {
    const clients = this.rooms.get(roomId);
    if (!clients) return;
    clients.delete(client);
    console.log(`Client left ${roomId}, ${clients.size} players remaining`);

    if (clients.size === 0) {
      this.phaseTimer.clear(roomId);
      this.rooms.delete(roomId);
      console.log(`Room ${roomId} deleted (empty)`);
    }
  }

  getRoomSize(roomId: string) {
    return this.rooms.get(roomId)?.size;
  }

  deleteRoom(roomId: string): void {
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
    if (clients.size === 0) this.deleteRoom(roomId);
  }
}
