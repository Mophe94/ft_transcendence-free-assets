import { Module } from '@nestjs/common';
import { ChatServiceController } from './app.controller';
import { ChatService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { wsAuthService } from 'libs/shared/src/auth/ws-auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ChatModule],
  controllers: [ChatServiceController],
  providers: [ChatService, ChatGateway, wsAuthService, JwtService],
})
export class ChatServiceModule {}
