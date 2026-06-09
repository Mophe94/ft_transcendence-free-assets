import { Module } from '@nestjs/common';
import { LobbyGateway } from './lobby.gateway';
import { LobbyService } from './lobby.service';
import { PhaseTimerService } from 'src/shared/phase-timer.service';


@Module({
  providers: [LobbyGateway, LobbyService, PhaseTimerService]
})
export class LobbyModule {}
