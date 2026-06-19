import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { wsAuthService } from './ws-auth.service';

@Module({
  imports: [JwtModule, ConfigModule],
  providers: [wsAuthService],
  exports: [wsAuthService],
})
export class authModule {}
