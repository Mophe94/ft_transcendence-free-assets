import { Injectable } from '@nestjs/common';
import { GamePayload } from './game.type';

@Injectable()
export class GameService {
	async handleEndMap(userId: number, payload: any) : Promise<void>{
	console.log('[GameService]: handleEndMap called');
	// load data from DB and return a Json to broadcast
	}
}