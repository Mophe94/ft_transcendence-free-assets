import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { SharedModule } from 'apps/game-service/src/shared/shared.module';
import { PlayerService } from './player/player.service';
import { CombatService } from './combat.service';
import { EntityModule } from './entities/entity.module';
import { RedisService } from '../redis/redis.service';
import { RedisStateService } from '../redis/redis_state.service';
import { MapService } from './map.service';

@Module({
  providers: [
    GameGateway,
    GameService,
    PlayerService,
    MapService,
    CombatService,
    RedisService,
    RedisStateService,
  ],
  imports: [SharedModule, EntityModule],
})
export class GameModule {}
