import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { SharedModule } from 'apps/game-service/src/shared/shared.module'
import { PlayerService } from './player/player.service';

@Module({
  providers: [GameGateway, GameService, PlayerService],
  imports: [SharedModule],
})
export class GameModule {}
