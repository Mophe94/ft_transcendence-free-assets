import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis/built';
import { REDIS_CLIENT } from './redis.const';
import { STATE_PLAYER } from '../game/state_player.const';

@Injectable()
export class RedisStateService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

/* ###################### PLAYER ###################### */

	async removePlayer(playerId: string): Promise<void> {
		const playerKey = STATE_PLAYER.player(playerId);
		const stateKey = STATE_PLAYER.state(playerId);

		await this.redis.del(stateKey);
		await this.redis.del(playerKey);
	}

/* ###################### STATE ###################### */

	async getStatePlayer(playerId: string): Promise<Object | undefined> {
		const key = STATE_PLAYER.state(playerId);
		const data = await this.redis.get(key);

		if (data)
			return JSON.parse(data);
		return undefined;
	}

	async updateStatePlayer(playerId: string, state: Object): Promise<void> {
		const key = STATE_PLAYER.state(playerId);
		// Expire after 1h
		await this.redis.set(key, JSON.stringify(state), "EX", 3600);
	}

	async removeStatePlayer(playerId: string): Promise<void> {
		const playerKey = STATE_PLAYER.player(playerId);
		const stateKey = STATE_PLAYER.state(playerId);
		
		await this.redis.del(stateKey);
		await this.redis.del(playerKey);
	}
}
