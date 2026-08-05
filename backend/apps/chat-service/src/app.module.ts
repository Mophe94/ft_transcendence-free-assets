import { Module } from '@nestjs/common';
import { ChatServiceController } from './app.controller';
import { ChatService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { WsAuthService } from 'libs/shared/src/auth/ws-auth.service';
import { JwtService } from '@nestjs/jwt';
import { SharedAuthService } from 'libs/shared/src/auth/shared-auth.service';

@Module({
  imports: [ChatModule],
  controllers: [ChatServiceController],
  providers: [ChatService, ChatGateway, JwtService],
})
export class ChatServiceModule {}
