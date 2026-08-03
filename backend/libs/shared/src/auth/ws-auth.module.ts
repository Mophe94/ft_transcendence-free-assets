import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WsAuthService } from './ws-auth.service';

@Module({
  imports: [JwtModule, ConfigModule],
  providers: [WsAuthService],
  exports: [WsAuthService],
})
export class WsAuthModule {}
