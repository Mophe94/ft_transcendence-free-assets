import { Module } from '@nestjs/common';
import { ChatServiceController } from './app.controller';
import { ChatModule } from './chat/chat.module';
import { JwtService } from '@nestjs/jwt';
import { HealthModule } from 'libs/shared/src/health/health.module';
import { ChatAppService } from './app.service';

@Module({
  imports: [ChatModule, HealthModule],
  controllers: [ChatServiceController],
  providers: [ChatAppService, JwtService],
})
export class ChatServiceModule {}
