import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { getSecret } from '../../../../libs/shared/src/utils/secret.utils';

import { JwtHttpGuard } from 'libs/shared/src/auth/guards/jwt-http.guard';
import { JwtWsGuard } from 'libs/shared/src/auth/guards/jwt-ws.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: getSecret('jwt_secret_key'),
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtHttpGuard, JwtWsGuard],
  exports: [AuthService, JwtHttpGuard, JwtWsGuard, JwtModule],
})
export class AuthModule {}
