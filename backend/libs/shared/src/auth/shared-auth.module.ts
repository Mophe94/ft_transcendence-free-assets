import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtHttpGuard } from './guards/jwt-http.guard';
import { JwtWsGuard } from './guards/jwt-ws.guard';
import { getSecret } from '../utils/secret.utils';
import { SharedAuthService } from './shared-auth.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getSecret('jwt_secret_key'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [JwtHttpGuard, JwtWsGuard, SharedAuthService],
  exports: [JwtModule, JwtHttpGuard, JwtWsGuard, SharedAuthService],
})
export class SharedJwtModule {}
