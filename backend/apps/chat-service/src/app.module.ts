import { Module } from '@nestjs/common';
import { ChatServiceController } from './app.controller';
import { ChatModule } from './chat/chat.module';
import { JwtService } from '@nestjs/jwt';
import { ChatAppService } from './app.service';

@Module({
  imports: [ChatModule],
  controllers: [ChatServiceController],
  providers: [ChatAppService, JwtService],
})
export class ChatServiceModule {}
