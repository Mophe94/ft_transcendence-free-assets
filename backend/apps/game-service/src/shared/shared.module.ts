import { Module } from '@nestjs/common';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RedisService } from '../redis/redis.service';

@Module({
  providers: [RoomService, PhaseTimerService, RedisService],
  exports: [RoomService, PhaseTimerService],
})
export class SharedModule {}
