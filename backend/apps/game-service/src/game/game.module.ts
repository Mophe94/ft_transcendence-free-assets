import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { SharedModule } from 'apps/game-service/src/shared/shared.module';
//import { PlayerService } from './player/player.service';
import { CombatService } from './combat.service';
import { EntityModule } from './entities/entity.module';
import { RedisService } from '../redis/redis.service';
import { RedisStateService } from '../redis/redis_state.service';
import { MapService } from './map.service';
import { AiModule } from './ai_service/ai.module';
import { PlayerModule } from './player/player.module';

@Module({
  providers: [
    GameGateway,
    GameService,
    MapService,
    CombatService,
    RedisService,
    RedisStateService,
  ],
  imports: [SharedModule, EntityModule, AiModule, PlayerModule],
})
export class GameModule {}
