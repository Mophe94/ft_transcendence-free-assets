import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis/built';
import { REDIS_CLIENT } from './redis.const';
import { STATE_PLAYER } from '../game/state_player.const';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

/* ###################### ROOM ###################### */

	async removeRoom(roomId: string): Promise<void> {
    const roomKey = STATE_PLAYER.room(roomId);
    const playersIds = await this.redis.smembers(roomKey);
	const roundKey = STATE_PLAYER.round(roomId);

    for (const playerId of playersIds) {
        const playerKey = STATE_PLAYER.player(roomId, playerId);
        await this.redis.del(playerKey);
    }

	await this.redis.del(roundKey);
    await this.redis.del(roomKey);
	}

/* ###################### PLAYER ###################### */

	async getPlayersInRoom(roomId: string): Promise<Array<string>> {
		const result = await this.redis.smembers(STATE_PLAYER.room(roomId));
		return result;
	}

	async addPlayer(roomId:string, playerId: string): Promise<void> {
		await this.redis.sadd(STATE_PLAYER.room(roomId), playerId);
	}

	async removePlayer(roomId: string, playerId: string): Promise<void> {
		const playerKey = STATE_PLAYER.player(roomId, playerId);
		const roomKey = STATE_PLAYER.room(roomId);

		/* del JSON and after remove playerid */
		await this.redis.del(playerKey);
		await this.redis.srem(roomKey, playerId);
	}

/* ###################### STATE ###################### */

	async getSatePlayer(roomId: string, playerId: string): Promise<Object | undefined> {
		const key = STATE_PLAYER.player(roomId, playerId);
		const data = await this.redis.get(key);

		if (data)
			return JSON.parse(data);
		return undefined;
	}

	async updateStatePlayer(roomId: string, playerId: string, state: Object): Promise<void> {
		const key = STATE_PLAYER.player(roomId, playerId);
		await this.redis.set(key, JSON.stringify(state));
	}

	async removeStatePlayer(roomId: string, playerId: string): Promise<void> {
		const key = STATE_PLAYER.player(roomId, playerId);
		
		await this.redis.del(key);
	}

/* ###################### STATE ###################### */

	async getRound(roomId: string): Promise<string | undefined> {
		const key = STATE_PLAYER.round(roomId);
		const data = await this.redis.get(key);

		if (data)
			return JSON.parse(data);
		return undefined;
	}

	async updateRound(roomId: string, round: string): Promise<void> {
		const key = STATE_PLAYER.round(roomId);
		await this.redis.set(key, JSON.stringify(round));
	}

	async removeRound(roomId: string): Promise<void> {
		const key = STATE_PLAYER.round(roomId);

		await this.redis.del(key);
	}

}
