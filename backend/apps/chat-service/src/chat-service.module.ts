import { Module } from '@nestjs/common';
import { ChatServiceController } from './chat-service.controller';
import { ChatServiceService } from './chat-service.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { wsAuthService } from 'libs/shared/src/auth/ws-auth.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [ChatModule],
  controllers: [ChatServiceController],
  providers: [ChatServiceService, ChatGateway, wsAuthService, JwtService],
})
export class ChatServiceModule {}
