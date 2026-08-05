import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LobbyModule } from './lobby/lobby.module';
import { GameModule } from './game/game.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { getSecret } from 'libs/shared/src/utils/secret.utils';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { LobbyController } from './lobby/lobby.controller';
import { AuthModule } from 'apps/user-service/src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_GAME_HOST') ?? 'localhost',
        port: configService.get<number>('DB_GAME_PORT') ?? 5432,
        username: getSecret('db_game_username'),
        password: getSecret('db_game_password'),
        database: getSecret('db_game_db_name'),
        synchronize: false,
        autoLoadEntities: true,
      }),
    }), // switch for GAME DB
    LobbyModule,
    GameModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    RedisModule,
  ],
  controllers: [AppController, LobbyController],
  providers: [AppService, RedisService],
})
export class AppModule {}
