import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ConfigModule } from '@nestjs/config';
import { SharedJwtModule } from 'libs/shared/src/auth/shared-auth.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    SharedJwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
