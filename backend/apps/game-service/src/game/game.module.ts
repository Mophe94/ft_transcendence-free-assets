import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { SharedModule } from 'apps/game-service/src/shared/shared.module'

@Module({
  providers: [GameGateway, GameService],
  imports: [SharedModule],
})
export class GameModule {}
