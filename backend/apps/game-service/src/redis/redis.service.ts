import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis/built';
import { REDIS_CLIENT } from './redis.const';
import { LOBBY_KEYS, DEFAULT, ROOM_IDS } from '../lobby/lobby.const';
import { randomUUID } from 'crypto';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  ///////////////////////////////* ROOM STATUS *///////////////////////////////

  async getActiveRooms(): Promise<Array<string>> {
    return await this.redis.smembers(LOBBY_KEYS.ACTIVE_ROOMS);
  }

  async getInactiveRooms(): Promise<Array<string>> {
    return await this.redis.smembers(LOBBY_KEYS.INACTIVE_ROOMS);
  }

  async freeRoomId(roomId: string): Promise<void> {
    await Promise.all([
      this.redis.srem(LOBBY_KEYS.USED_IDS, roomId),
      this.redis.sadd(LOBBY_KEYS.FREE_IDS, roomId),
    ]);
  }

  async addActiveRoom(roomId: string): Promise<void> {
    await this.redis.sadd(LOBBY_KEYS.ACTIVE_ROOMS, roomId);
  }

  async addInactiveRoom(roomId: string): Promise<void> {
    await this.redis.sadd(LOBBY_KEYS.INACTIVE_ROOMS, roomId);
  }

  async removeActiveRoom(roomId: string): Promise<void> {
    await this.redis.srem(LOBBY_KEYS.ACTIVE_ROOMS, roomId);
  }

  async removeInactiveRoom(roomId: string): Promise<void> {
    await this.redis.srem(LOBBY_KEYS.INACTIVE_ROOMS, roomId);
  }

  async markRoomActive(roomId: string): Promise<void> {
    await Promise.all([
      this.addActiveRoom(roomId),
      this.removeInactiveRoom(roomId),
    ]);
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
    return timestamp === null ? 0 : parseInt(timestamp, 10);
  }

  async deleteRoomTimer(roomId: string): Promise<void> {
    await this.redis.del(LOBBY_KEYS.ROOM_TIMER(roomId));
  }

  ///////////////////////////////* CAPACITY *///////////////////////////////

  async setRoomCapacity(
    roomId: string,
    capacity: number = DEFAULT.CAPACITY,
  ): Promise<void> {
    if (capacity <= 0 || (capacity & (capacity - 1)) !== 0) {
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

  async addPlayerToRoom(
    playerId: string,
    roomId: string,
    username: string,
    skin: string,
  ): Promise<void> {
    await this.redis.hset(
      LOBBY_KEYS.ROOM_PLAYERS(roomId),
      playerId,
      JSON.stringify({ username, skin }),
    );
  }

  async removePlayerFromRoom(playerId: string, roomId: string): Promise<void> {
    await this.redis.hdel(LOBBY_KEYS.ROOM_PLAYERS(roomId), playerId);
  }

  async getPlayersFromRoom(
    roomId: string,
  ): Promise<Array<{ username: string; skin: string; isBot: boolean }>> {
    const rawPlayersMap = await this.redis.hgetall(
      LOBBY_KEYS.ROOM_PLAYERS(roomId),
    );
    return Object.entries(rawPlayersMap).map(([playerId, jsonValue]) => {
      const playerData = JSON.parse(jsonValue) as {
        username: string;
        skin: string;
      };
      return {
        username: playerData.username,
        skin: playerData.skin,
        isBot: playerId.startsWith('bot-'),
      };
    });
  }

  async countPlayersInRoom(roomId: string): Promise<number> {
    return await this.redis.hlen(LOBBY_KEYS.ROOM_PLAYERS(roomId));
  }

  async deleteAllPlayersFromRoom(roomId: string): Promise<void> {
    await this.redis.del(LOBBY_KEYS.ROOM_PLAYERS(roomId));
  }
  ///////////////////////////////* ROOM ID POOL *///////////////////////////////

  async getRandRoomId(): Promise<string> {
    const id = await this.redis.spop(LOBBY_KEYS.FREE_IDS);
    if (id) {
      await this.redis.sadd(LOBBY_KEYS.USED_IDS, id);
      return id;
    }
    return randomUUID();
  }

  // async freeRoomId(roomId: string): Promise<void> {
  //   await this.redis.srem(LOBBY_KEYS.USED_IDS, roomId);
  //   if (ROOM_IDS.includes(roomId)) {
  //     await this.redis.sadd(LOBBY_KEYS.FREE_IDS, roomId);
  //   }
  // }

  ///////////////////////////////* ROOM LIFECYCLE *///////////////////////////////

  async createRoom(capacity?: number): Promise<string> {
    const id = await this.getRandRoomId();
    await Promise.all([
      this.addInactiveRoom(id),
      this.setRoomCapacity(id, capacity),
      this.setRoomTimer(id),
    ]);
    return id;
  }

  async deleteRoom(roomId: string): Promise<void> {
    await Promise.all([
      this.removeActiveRoom(roomId),
      this.removeInactiveRoom(roomId),
      this.deleteRoomTimer(roomId),
      this.deleteRoomCapacity(roomId),
      this.deleteAllPlayersFromRoom(roomId),
      this.deleteRoomBots(roomId),
      this.freeRoomId(roomId),
    ]);
  }

  ///////////////////////////////* GENERIC SET/LIST HELPERS *///////////////////////////////

  async setData(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 3600);
  }

  async getData(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async addToSet(key: string, elems: Array<string>): Promise<void> {
    if (elems?.length !== 0) await this.redis.sadd(key, ...elems);
  }

  async removeFromSet(key: string, elems: Array<string>): Promise<void> {
    if (elems?.length !== 0) await this.redis.srem(key, ...elems);
  }

  async isInSet(key: string, elem: string): Promise<boolean> {
    return (await this.redis.sismember(key, elem)) === 1;
  }

  async getSet(key: string): Promise<Array<string>> {
    return await this.redis.smembers(key);
  }

  async getSetLen(key: string): Promise<number> {
    return await this.redis.scard(key);
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
    return await this.redis.lrange(key, start, end);
  }

  ///////////////////////////////* AI  *///////////////////////////////

  async addBotToRoom(botId: string, roomId: string): Promise<void> {
    await this.redis.sadd(LOBBY_KEYS.ROOM_BOTS(roomId), botId);
  }

  async removeBotFromRoom(botId: string, roomId: string): Promise<void> {
    await this.redis.srem(LOBBY_KEYS.ROOM_BOTS(roomId), botId);
  }

  async getRoomBots(roomId: string): Promise<string[]> {
    return await this.redis.smembers(LOBBY_KEYS.ROOM_BOTS(roomId));
  }

  /**
   * Retire ET renvoie UN bot au hasard du set de la room, en une seule
   * opération atomique côté Redis (SPOP). Contrairement à un
   * getRoomBots() + removeBotFromRoom() séparés, deux appels
   * concurrents (deux vrais joueurs qui rejoignent en même temps) ne
   * peuvent jamais tomber sur le même botId : Redis garantit que
   * chaque SPOP retire un élément différent. C'est ce qui évite la
   * race condition qui laissait passer une room à 5/4.
   */
  async popRoomBot(roomId: string): Promise<string | null> {
    return await this.redis.spop(LOBBY_KEYS.ROOM_BOTS(roomId));
  }

  async deleteRoomBots(roomId: string): Promise<void> {
    await this.redis.del(LOBBY_KEYS.ROOM_BOTS(roomId));
  }
}