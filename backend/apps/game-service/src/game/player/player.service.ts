import { Injectable } from '@nestjs/common';
import { Player } from './player'

@Injectable()
export class PlayerService {
	players = new Map<number, Player>();

	initPlayer(userId: number/* , payload: any */): void {
		const player = new Player (
			userId,
			'Test', //need to retrieve name from userDB
			'dino',
		)
		this.players.set(userId, player)
	}

	getPlayer(userId: number): Player | undefined {
		return this.players.get(userId);
	}

	removePlayer(userId: number): void {
		this.players.delete(userId);
	}
}
