import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { SharedModule } from 'apps/game-service/src/shared/shared.module';
import { PlayerService } from './player/player.service';
import { CombatService } from './combat.service';
import { EntityModule } from './entities/entity.module';
import { RedisService } from '../redis/redis.service';
import { WsAuthModule } from 'libs/shared/src/auth/ws-auth.module';
import { MapService } from './map.service';

import { AiService } from './ai_service/ai.service';
import { RedisStateService } from '../redis/redis_state_player.service';
@Module({
  providers: [
    GameGateway,
    GameService,
    PlayerService,
    MapService,
    CombatService,
    RedisService,
    RedisStateService,
    AiService,
  ],
  imports: [SharedModule, EntityModule, WsAuthModule],
})
export class GameModule {}
