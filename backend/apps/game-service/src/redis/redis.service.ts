import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis/built';
import { REDIS_CLIENT } from './redis.const';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async setData(key: string, value: string): Promise<string> {
    await this.redis.set(key, value, 'EX', 3600);
    return 'Ok';
  }

  async getData(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }
}
