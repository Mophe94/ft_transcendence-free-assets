import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { SharedModule } from 'apps/game-service/src/shared/shared.module';
import { PlayerService } from './player/player.service';
import { CombatService } from './combat.service';
import { EntityModule } from './entities/entity.module';
import { RedisService } from '../redis/redis.service';
import { AiService } from './ai_service/ai.service';
@Module({
  providers: [
    GameGateway,
    GameService,
    PlayerService,
    CombatService,
    RedisService,
    AiService,
  ],
  imports: [SharedModule, EntityModule],
})
export class GameModule {}
