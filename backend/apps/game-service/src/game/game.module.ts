import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { SharedModule } from 'apps/game-service/src/shared/shared.module';
import { PlayerService } from './player/player.service';
import { EntityModule } from './entities/entity.module';
import { RedisService } from '../redis/redis.service';
@Module({
  providers: [GameGateway, GameService, PlayerService, RedisService],
  imports: [SharedModule, EntityModule],
})
export class GameModule {}
