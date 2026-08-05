import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ConfigModule } from '@nestjs/config';
import { SharedJwtModule } from 'libs/shared/src/auth/shared-auth.module';

@Module({
  imports: [
    SharedJwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [ChatService],
})
export class ChatModule {}
