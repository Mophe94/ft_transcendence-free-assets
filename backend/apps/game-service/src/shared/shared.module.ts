import { Module } from '@nestjs/common';
import { RoomService } from 'apps/game-service/src/shared/room.service';
import { PhaseTimerService } from 'apps/game-service/src/shared/phase-timer.service';

@Module({
  providers: [RoomService, PhaseTimerService],
  exports: [RoomService, PhaseTimerService],
})
export class SharedModule {}
