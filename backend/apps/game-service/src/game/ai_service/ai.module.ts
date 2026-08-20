import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiOrchestratorService } from './ai.orchestrator.service';
import { PlayerModule } from '../player/player.module';

@Module({
    imports: [PlayerModule],
    providers : [AiService, AiOrchestratorService],
    exports: [AiService, AiOrchestratorService],
})
export class AiModule {}