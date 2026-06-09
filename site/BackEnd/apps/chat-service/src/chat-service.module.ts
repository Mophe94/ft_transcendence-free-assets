import { Module } from '@nestjs/common';
import { ChatServiceController } from './chat-service.controller';
import { ChatServiceService } from './chat-service.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [ChatServiceController],
  providers: [ChatServiceService, ChatGateway],
})
export class ChatServiceModule {}
