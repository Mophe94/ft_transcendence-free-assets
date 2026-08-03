import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis/built';
import { REDIS_CLIENT } from './redis.const';
import { LOBBY_KEYS, DEFAULT } from '../lobby/lobby.const';
import { randomUUID } from 'crypto';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async addInactiveRoom(roomId: string): Promise<void> {
    await this.redis.sadd(LOBBY_KEYS.INACTIVE_ROOMS, roomId);
  }

  async removeInactiveRoom(roomId: string): Promise<void> {
    await this.redis.srem(LOBBY_KEYS.INACTIVE_ROOMS, roomId);
  }

  async getInactiveRooms(): Promise<Array<string>> {
    const members = await this.redis.smembers(LOBBY_KEYS.INACTIVE_ROOMS);
    return members;
  }

  async setRoomTimer(
    roomId: string,
    countdown: number = DEFAULT.COUNTDOWN,
  ): Promise<void> {
    const endTime = Date.now() + 1000 * countdown;
    await this.redis.set(`room:${roomId}:timer`, endTime);
  }

  async getRoomTimer(roomId: string): Promise<number> {
    const timestamp = await this.redis.get(`room:${roomId}:timer`);
    if (timestamp === null) return 0;
    return parseInt(timestamp, 10);
  }

  async setRoomCapacity(roomId: string, capacity: number): Promise<void> {
    await this.redis.set(LOBBY_KEYS.ROOM_CAPACITY(roomId), capacity);
  }

  async getRandRoomId(): Promise<string> {
    const id = await this.redis.spop(LOBBY_KEYS.FREE_IDS);
    return id ? id : randomUUID();
  }

  async freeRoomId(roomId: string): Promise<void> {
    await Promise.all([
      this.redis.srem(LOBBY_KEYS.USED_IDS, roomId),
      this.redis.sadd(LOBBY_KEYS.FREE_IDS, roomId),
    ]);
  }

  async getRoomCapacity(
    roomId: string,
    capacity: number = DEFAULT.CAPACITY,
  ): Promise<void> {
    await this.redis.set(`room:${roomId}:capacity`, capacity);
  }

  async addActiveRoom(roomId: string): Promise<void> {
    await this.redis.sadd(LOBBY_KEYS.ACTIVE_ROOMS, roomId);
  }

  async addPlayerToRoom(playerId: string, roomId: string): Promise<void> {
    await this.redis.sadd(LOBBY_KEYS.ROOM_PLAYERS(roomId), playerId);
  }
  async removePlayerFromRoom(playerId: string, roomId: string): Promise<void> {
    await this.redis.srem(LOBBY_KEYS.ROOM_PLAYERS(roomId), playerId);
  }
  async getPlayersFromRoom(roomId: string): Promise<Array<string>> {
    const players = await this.redis.smembers(LOBBY_KEYS.ROOM_PLAYERS(roomId));
    return players;
  }
  async countPlayersInRoom(roomId: string): Promise<number> {
    const nb_players = await this.redis.scard(LOBBY_KEYS.ROOM_PLAYERS(roomId));
    return nb_players;
  }

  async removeActiveRoom(roomId: string): Promise<void> {
    await this.redis.srem(LOBBY_KEYS.ACTIVE_ROOMS, roomId);
  }

  async getActiveRooms(): Promise<Array<string>> {
    const members = await this.redis.smembers(LOBBY_KEYS.ACTIVE_ROOMS);
    return members;
  }

  async setData(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 3600);
  }

  async getData(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async addToSet(key: string, elems: Array<string>): Promise<void> {
    if (elems?.length !== 0) {
      await this.redis.sadd(key, ...elems);
    }
  }

  async removeFromSet(key: string, elems: Array<string>): Promise<void> {
    if (elems?.length !== 0) {
      await this.redis.srem(key, ...elems);
    }
  }

  async isInSet(key: string, elem: string): Promise<boolean> {
    const isMember = await this.redis.sismember(key, elem);
    return isMember === 1;
  }

  async getSet(key: string): Promise<Array<string>> {
    const members = await this.redis.smembers(key);
    return members;
  }

  async getSetLen(key: string): Promise<number> {
    const count = await this.redis.scard(key);
    return count;
  }

  async prependToList(key: string, elems: string): Promise<void> {
    await this.redis.lpush(key, ...elems);
  }

  async appendToList(key: string, elems: string): Promise<void> {
    await this.redis.rpush(key, ...elems);
  }

  async getList(
    key: string,
    start: number,
    end: number,
  ): Promise<Array<string>> {
    const members = await this.redis.lrange(key, start, end);
    return members;
  }
}
