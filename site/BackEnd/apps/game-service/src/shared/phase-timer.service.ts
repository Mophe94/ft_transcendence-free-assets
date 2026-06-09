import { Injectable } from '@nestjs/common';
import { FULL_LOBBY, PHASE_DURATIONS, PhaseName } from 'apps/game-service/src/game/game.type';

@Injectable()
export class PhaseTimerService {

	private timers = new Map<string, NodeJS.Timeout>();

	start(roomId: string, phase: PhaseName, onTimeout: () => void) : void {
		this.clear(roomId);
		const duration = PHASE_DURATIONS[phase];
		this.timers.set(roomId, setTimeout(onTimeout, duration * 1000));
		}

	clear(roomId: string): void {
		const handle = this.timers.get(roomId);
		if (handle) {
			clearTimeout(handle);
			this.timers.delete(roomId);
		}
		}
	}