import { Global, Module } from '@nestjs/common';
import { getSecret } from 'libs/shared/src/utils/secret.utils';
import { RedisService } from './redis.service';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.const';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        return new Redis({
          host: 'redis',
          port: 6379,
          password: getSecret('redis_password'),
        });
      },
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
