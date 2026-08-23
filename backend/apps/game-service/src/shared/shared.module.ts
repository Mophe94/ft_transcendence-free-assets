import { Module } from '@nestjs/common';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';
import { RedisService } from '../redis/redis.service';
import { RoomMutexService } from './room-mutex.service';

@Module({
  providers: [RoomService, PhaseTimerService, RedisService, RoomMutexService],
  exports: [RoomService, PhaseTimerService, RoomMutexService],
})
export class SharedModule {}
