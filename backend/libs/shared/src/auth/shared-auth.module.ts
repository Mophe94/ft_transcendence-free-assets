import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtHttpGuard } from './guards/jwt-http.guard';
import { JwtWsGuard } from './guards/jwt-ws.guard';
import { getSecret } from '../utils/secret.utils';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        secret: getSecret('jwt_secret_key'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [JwtHttpGuard, JwtWsGuard],
  exports: [JwtModule, JwtHttpGuard, JwtWsGuard],
})
export class SharedJwtModule {}
