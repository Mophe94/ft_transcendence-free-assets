import { Injectable, OnModuleInit } from '@nestjs/common';
import { GamePayload } from './game.type';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';

@Injectable()
export class GameService implements OnModuleInit {
  constructor(private phaseTimer: PhaseTimerService) {}

  // TEST with hardcoded values
  onModuleInit(): void {
    this.registerRoom('test-room', [1, 2, 3, 4, 5, 6, 7, 8]);
  }
  // roomIds + authorized users -> next Redis
  private autorizedPlayers = new Map<string, Set<number>>();
  registerRoom(roomId: string, userIds: number[]): void {
    this.autorizedPlayers.set(roomId, new Set(userIds));
  }

  isPlayerInRoom(userId: number, roomId: string): boolean {
    return this.autorizedPlayers.get(roomId)?.has(userId) ?? false;
  }

  startMapPhase(roomId: string): void {
    this.phaseTimer.start(roomId, 'map', () => {
      console.log(`Room ${roomId} map phase timeout`);
    });
  }

  async handleEndMap(userId: number, payload: any): Promise<void> {
    console.log('[GameService]: handleEndMap called');
    // load data from DB and return a Json to broadcast
  }
}
