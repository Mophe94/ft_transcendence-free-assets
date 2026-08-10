import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis/built';
import { REDIS_CLIENT } from './redis.const';
import { LOBBY_KEYS, DEFAULT, ROOM_IDS } from '../lobby/lobby.const';
import { randomUUID } from 'crypto';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  ///////////////////////////////* ROOM *///////////////////////////////

  async getActiveRooms(): Promise<Array<string>> {
    return await this.redis.smembers(LOBBY_KEYS.ACTIVE_ROOMS);
  }

  async getInactiveRooms(): Promise<Array<string>> {
    return await this.redis.smembers(LOBBY_KEYS.INACTIVE_ROOMS);
  }

  async addActiveRoom(roomId: string): Promise<void> {
    await this.redis.sadd(LOBBY_KEYS.ACTIVE_ROOMS, roomId);
  }

  async addInactiveRoom(roomId: string): Promise<void> {
    await this.redis.sadd(LOBBY_KEYS.INACTIVE_ROOMS, roomId);
  }

  async removeInactiveRoom(roomId: string): Promise<void> {
    await this.redis.srem(LOBBY_KEYS.INACTIVE_ROOMS, roomId);
  }

  async removeActiveRoom(roomId: string): Promise<void> {
    await this.redis.srem(LOBBY_KEYS.ACTIVE_ROOMS, roomId);
  }

  ///////////////////////////////* TIMER *///////////////////////////////

  async setRoomTimer(
    roomId: string,
    countdown: number = DEFAULT.COUNTDOWN,
  ): Promise<void> {
    const endTime = Date.now() + 1000 * countdown;
    await this.redis.set(LOBBY_KEYS.ROOM_TIMER(roomId), endTime.toString());
  }

  async getRoomTimer(roomId: string): Promise<number> {
    const timestamp = await this.redis.get(LOBBY_KEYS.ROOM_TIMER(roomId));
    if (timestamp === null) return 0;
    return parseInt(timestamp, 10);
  }

  async deleteRoomTimer(roomId: string): Promise<void> {
	await this.redis.del(LOBBY_KEYS.ROOM_TIMER(roomId));
  }
  ///////////////////////////////* CAPACITY *///////////////////////////////

  async setRoomCapacity(roomId: string, capacity: number = DEFAULT.CAPACITY): Promise<void> {
	if (capacity <= 0)
		capacity = DEFAULT.CAPACITY;
	else{
		let result = (capacity & (capacity - 1)) !== 0;
		if (result)
			capacity = DEFAULT.CAPACITY;
	}
    await this.redis.set(LOBBY_KEYS.ROOM_CAPACITY(roomId), capacity);
  }

  async getRoomCapacity(roomId: string): Promise<number> {
    const capacity = await this.redis.get(LOBBY_KEYS.ROOM_CAPACITY(roomId));
	return capacity ? parseInt(capacity, 10) : DEFAULT.CAPACITY;
  }

  async deleteRoomCapacity(roomId: string): Promise<void> {
	await this.redis.del(LOBBY_KEYS.ROOM_CAPACITY(roomId));
  }

  ///////////////////////////////* PLAYERS *///////////////////////////////

  async addPlayerToRoom(playerId: string, roomId: string): Promise<void> {
    await this.redis.sadd(LOBBY_KEYS.ROOM_PLAYERS(roomId), playerId);
  }
  async removePlayerFromRoom(playerId: string, roomId: string): Promise<void> {
    await this.redis.srem(LOBBY_KEYS.ROOM_PLAYERS(roomId), playerId);
  }
  async getPlayersFromRoom(roomId: string): Promise<Array<string>> {
    return await this.redis.smembers(LOBBY_KEYS.ROOM_PLAYERS(roomId));
  }

  async countPlayersInRoom(roomId: string): Promise<number> {
    return await this.redis.scard(LOBBY_KEYS.ROOM_PLAYERS(roomId));
  }

  async deleteAllPlayerFromRoom(roomId: string): Promise<void> {
	await this.redis.del(LOBBY_KEYS.ROOM_PLAYERS(roomId));
  }

  ///////////////////////////////* ROOM ID *///////////////////////////////

  async getRandRoomId(): Promise<string> {
    const id = await this.redis.spop(LOBBY_KEYS.FREE_IDS);
	return id ? id : randomUUID();
  }

  async freeRoomID(roomId: string): Promise<void> {
	const data = ROOM_IDS.includes(roomId);
	if (data) {
    	await this.redis.smove(LOBBY_KEYS.USED_IDS, LOBBY_KEYS.FREE_IDS, roomId);
	}
	else {
		await this.redis.srem(LOBBY_KEYS.USED_IDS, roomId);
	}
  }

  ///////////////////////////////* UTILITY *///////////////////////////////

  async createRoom(capacity?: string): Promise<string>{
	const id = await this.getRandRoomId();
	await Promise.all ([
	this.addInactiveRoom(id),
	this.setRoomCapacity(id, capacity ? Number(capacity) : undefined),
	this.setRoomTimer(id),
	])
	return id;
  }

  async deleteRoom(roomId: string): Promise<void> {
	await Promise.all([
	this.deleteRoomTimer(roomId),
	this.deleteRoomCapacity(roomId),
	this.deleteAllPlayerFromRoom(roomId),
	this.freeRoomID(roomId),
	])
  }

  ///////////////////////////////* OTHER *///////////////////////////////

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
