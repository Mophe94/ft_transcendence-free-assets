import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
	async handleEndMap(userId: number, payload: any) : Promise<void>{
	console.log('[Service Game]: handleEndMap called');
	//return a Json to broadcast
}
}
