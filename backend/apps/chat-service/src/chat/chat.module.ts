import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ConfigModule } from '@nestjs/config';
import { WsAuthService } from 'libs/shared/src/auth/ws-auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [ChatService, WsAuthService, JwtService],
})
export class ChatModule {}
