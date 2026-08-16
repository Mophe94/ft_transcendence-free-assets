import { Module } from '@nestjs/common';
import { ChatServiceController } from './app.controller';
import { ChatModule } from './chat/chat.module';
import { JwtService } from '@nestjs/jwt';
import { HealthModule } from 'libs/shared/src/health/health.module';
import { ChatAppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [ChatModule, HealthModule, EventEmitterModule.forRoot()],
  controllers: [ChatServiceController],
  providers: [ChatAppService, JwtService],
})
export class ChatServiceModule {}
