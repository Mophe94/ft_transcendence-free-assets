import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class CombatService {
	// combatRoomId -> [userIdA, userIdB]
	private combatRooms = new Map<string, [number, number]>();
	// userId -> combatRoomId
	private playerCombatRoom = new Map<number, string>();

	// Called when a room in GameService reaches FULL state
	matchmake(rooms: Set<number>): void {
		const players = [...rooms];

		while (players.length >= 2) {
			const indexA = Math.floor(Math.random() * players.length);
			const [userIdA] = players.splice(indexA, 1);
			
			const indexB = Math.floor(Math.random() * players.length);
			const [userIdB] = players.splice(indexB, 1);

			const combatRoomId = randomUUID();
			this.combatRooms.set(combatRoomId, [userIdA, userIdB]);
			this.playerCombatRoom.set(userIdA, combatRoomId);
			this.playerCombatRoom.set(userIdB, combatRoomId);
		}

		if (players.length === 1) {
			console.log(`[CombatService] ${players[0]} left without an opponent `);
		}
	}

	getOpponentId(userId: number): number | undefined {
		const combatRoomId = this.playerCombatRoom.get(userId);
		if (!combatRoomId) 
			return undefined;
	
		const [userIdA, userIdB] = this.combatRooms.get(combatRoomId)!;
		return userIdA === userId ? userIdB : userIdA;
	}
}