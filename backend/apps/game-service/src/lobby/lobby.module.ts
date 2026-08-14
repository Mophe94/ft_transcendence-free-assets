import { Module } from '@nestjs/common';
import { LobbyGateway } from './lobby.gateway';
import { SharedModule } from 'apps/game-service/src/shared/shared.module';
import { LobbyService } from './lobby.service';
import { RedisService } from '../redis/redis.service';
import { SharedJwtModule } from 'libs/shared/src/auth/shared-auth.module';

@Module({
  providers: [LobbyGateway, LobbyService, RedisService],
  imports: [SharedModule, SharedJwtModule],
})
export class LobbyModule {}
