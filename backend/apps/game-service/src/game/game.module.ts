import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';

@Module({
  providers: [GameGateway, GameService, PhaseTimerService],
})
export class GameModule {}
